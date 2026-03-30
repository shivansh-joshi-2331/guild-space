import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { MAP_WIDTH_TILES, MAP_HEIGHT_TILES, WALLS, DOORS, DESKS } from '../utils/mapGeometry';
import { notificationsChannel } from '../lib/supabase';

const MOVES = {
  KeyW: { dx: 0, dy: -1 },
  ArrowUp: { dx: 0, dy: -1 },
  KeyS: { dx: 0, dy: 1 },
  ArrowDown: { dx: 0, dy: 1 },
  KeyA: { dx: -1, dy: 0 },
  ArrowLeft: { dx: -1, dy: 0 },
  KeyD: { dx: 1, dy: 0 },
  ArrowRight: { dx: 1, dy: 0 },
};

const TILE_SPEED = 10;
const PLAYER_SIZE = 0.8;
const OFFSET = 0.1;
const AFK_TIMEOUT = 5 * 60 * 1000; // 5 minutes

const isColliding = (px, py, pw, ph, rect) => {
  return px < rect.x + rect.w &&
         px + pw > rect.x &&
         py < rect.y + rect.h &&
         py + ph > rect.y;
};

const isNearDesk = (px, py, desk) => {
  return Math.abs(px - desk.x) < 3 && Math.abs(py - desk.y) < 3;
};

let lastKnockTime = 0;
const triggerKnock = (door) => {
  const now = performance.now();
  if (now - lastKnockTime > 2000) {
    lastKnockTime = now;
    
    // Check if door owner has focus mode — if so, block the knock
    const players = useGameStore.getState().players;
    const ownerPlayer = Object.values(players).find(p => p.member_id === door.ownerId);
    if (ownerPlayer?.focusMode) {
      window.dispatchEvent(new CustomEvent('in-game-notification', {
        detail: { message: `🔒 ${door.ownerName} is in Deep Focus mode! Cannot knock right now.` }
      }));
      return;
    }

    window.dispatchEvent(new CustomEvent('in-game-notification', {
      detail: { message: `🗯️ *BAM BAM BAM* You aggressively knocked on ${door.ownerName}'s door! (Notification Sent)` }
    }));

    const knockerName = useGameStore.getState().currentUser?.name || 'Someone';
    notificationsChannel.send({
      type: 'broadcast',
      event: 'knock',
      payload: { knockerName, ownerId: door.ownerId }
    });

    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const playKnock = (delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, ctx.currentTime + delay);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + delay + 0.1);
        gain.gain.setValueAtTime(1, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.1);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.1);
      };
      playKnock(0);
      playKnock(0.15);
      playKnock(0.3);
    } catch (_err) { /* audio not available */ }
  }
};

export function useMovement() {
  const { setMyPosition } = useGameStore();

  useEffect(() => {
    const activeKeys = new Set();
    let rAF;
    let lastTime = performance.now();
    let lastActivityTime = Date.now();

    const checkWalls = (nx, ny) => {
      for (const wall of WALLS) {
        if (isColliding(nx + OFFSET, ny + OFFSET, PLAYER_SIZE, PLAYER_SIZE, wall)) return true;
      }
      return false;
    };

    const checkDoors = (nx, ny) => {
      for (const key in DOORS) {
        const door = DOORS[key];
        if (isColliding(nx + OFFSET, ny + OFFSET, PLAYER_SIZE, PLAYER_SIZE, door)) return door;
      }
      return null;
    };

    // AFK check interval
    const afkInterval = setInterval(() => {
      const elapsed = Date.now() - lastActivityTime;
      if (elapsed > AFK_TIMEOUT) {
        useGameStore.getState().setAfk(true);
      }
    }, 10000);

    const loop = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const { myPosition, currentUser } = useGameStore.getState();

      if (activeKeys.size > 0 && currentUser) {
        // Any movement resets AFK
        lastActivityTime = Date.now();
        useGameStore.getState().setAfk(false);

        let dx = 0;
        let dy = 0;

        activeKeys.forEach(key => {
          if (MOVES[key]) {
            dx += MOVES[key].dx;
            dy += MOVES[key].dy;
          }
        });

        if (dx !== 0 && dy !== 0) {
           const length = Math.sqrt(dx * dx + dy * dy);
           dx /= length;
           dy /= length;
        }

        let newX = myPosition.x + dx * TILE_SPEED * dt;
        let newY = myPosition.y;

        let hitDoorX = checkDoors(newX, newY);
        if (checkWalls(newX, newY)) newX = myPosition.x;

        newY = myPosition.y + dy * TILE_SPEED * dt;
        let hitDoorY = checkDoors(newX, newY);
        if (checkWalls(newX, newY)) newY = myPosition.y;

        const hitDoor = hitDoorX || hitDoorY;
        
        let dir = myPosition.direction;
        if (dx > 0) dir = 'right';
        else if (dx < 0) dir = 'left';

        if (newX < 0) newX = 0;
        if (newX >= MAP_WIDTH_TILES) newX = MAP_WIDTH_TILES - 1;
        if (newY < 0) newY = 0;
        if (newY >= MAP_HEIGHT_TILES) newY = MAP_HEIGHT_TILES - 1;

        if (hitDoor && hitDoor.ownerId !== currentUser.id) {
           triggerKnock(hitDoor);
           newX = myPosition.x;
           newY = myPosition.y;
        }

        if (newX !== myPosition.x || newY !== myPosition.y || dir !== myPosition.direction) {
          setMyPosition(newX, newY, dir);
        }
      }

      rAF = requestAnimationFrame(loop);
    };

    const handleKeyDown = (e) => {
      if (MOVES[e.code]) {
        activeKeys.add(e.code);
        lastActivityTime = Date.now();
      }
      
      // F key = Toggle Focus Mode
      if (e.code === 'KeyF' && !e.repeat) {
        useGameStore.getState().toggleFocusMode();
      }

      // E key = Desk Interaction
      if (e.code === 'KeyE' && !e.repeat) {
        const { myPosition, currentUser, deskUrls, setDeskUrl } = useGameStore.getState();
        for (const desk of DESKS) {
          if (isNearDesk(myPosition.x, myPosition.y, desk)) {
            if (desk.ownerId === currentUser.id) {
              // It's our desk — set URL
              const url = prompt('Paste your active Figma link:');
              if (url && url.trim()) {
                setDeskUrl(desk.ownerId, url.trim());
                window.dispatchEvent(new CustomEvent('in-game-notification', {
                  detail: { message: `🖥️ Figma link saved to your desk!` }
                }));
              }
            } else {
              // It's someone else's desk — open their URL
              const savedUrl = deskUrls[desk.ownerId];
              if (savedUrl) {
                window.open(savedUrl, '_blank');
              } else {
                window.dispatchEvent(new CustomEvent('in-game-notification', {
                  detail: { message: `🖥️ ${desk.ownerName}'s desk is empty — no Figma link set yet.` }
                }));
              }
            }
            break;
          }
        }
      }
    };

    const handleKeyUp = (e) => {
      if (activeKeys.has(e.code)) activeKeys.delete(e.code);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    rAF = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(rAF);
      clearInterval(afkInterval);
    };
  }, [setMyPosition]);
}
