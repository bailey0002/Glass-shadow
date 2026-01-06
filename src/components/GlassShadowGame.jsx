import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';

// ============ THEMES ============
const THEMES = {
  silver: {
    bg: { primary: '#0a0c0e', secondary: '#0d0f12', panel: 'rgba(12, 14, 18, 0.95)' },
    chrome: { bright: '#c0c5ce', medium: '#8a9199', dim: '#5a6066', dark: '#3a3e44' },
    accent: { gold: '#c9a227', cyan: '#4a9ebb', danger: '#b54a4a', success: '#4a8a5a', warning: '#b5944a' },
    text: { primary: '#d0d5dc', secondary: '#9aa0a8', dim: '#6a7078' }
  },
  dos: {
    bg: { primary: '#0a0a0a', secondary: '#0d0d0d', panel: 'rgba(10, 10, 10, 0.95)' },
    chrome: { bright: '#33ff33', medium: '#22bb22', dim: '#118811', dark: '#0a440a' },
    accent: { gold: '#33ff33', cyan: '#22dd22', danger: '#ff3333', success: '#33ff33', warning: '#ffff33' },
    text: { primary: '#33ff33', secondary: '#22bb22', dim: '#118811' }
  }
};

// ============ UTILITIES ============
const useTypewriter = (text, speed = 25, garble = 0) => {
  const [displayed, setDisplayed] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    if (!text) return;
    setIsTyping(true);
    setDisplayed('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        let char = text.charAt(i);
        if (garble > 0 && Math.random() < garble * 0.3) {
          char = '█▓▒░╳'[Math.floor(Math.random() * 5)];
        }
        setDisplayed(prev => prev + char);
        i++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, speed + (garble * 10));
    return () => clearInterval(timer);
  }, [text, speed, garble]);
  
  return { displayed, isTyping, skip: () => { setDisplayed(text); setIsTyping(false); } };
};

const rollDice = (mod = 0, dc = 10, pulseMod = 0) => {
  const roll = Math.floor(Math.random() * 20) + 1;
  const total = roll + mod + pulseMod;
  return { roll, total, success: total >= dc, isCrit: roll === 20, isFumble: roll === 1 };
};

const getPulseEffects = (pulse) => {
  if (pulse >= 140) return { garble: 0.4, penalty: -3, label: 'CRITICAL', color: 'danger' };
  if (pulse >= 110) return { garble: 0.2, penalty: -2, label: 'ELEVATED', color: 'warning' };
  if (pulse >= 90) return { garble: 0.05, penalty: -1, label: 'ALERT', color: 'warning' };
  if (pulse >= 70) return { garble: 0, penalty: 0, label: 'STEADY', color: 'success' };
  return { garble: 0, penalty: 1, label: 'CALM', color: 'success' };
};

// ============ SLOANE PANEL ============
const SloanePanel = ({ message, expanded, onToggle, onConverse, gameState, theme }) => {
  const fx = getPulseEffects(gameState.pulse);
  const { displayed, isTyping } = useTypewriter(message, 22, fx.garble);
  const [chatting, setChatting] = useState(false);
  
  const options = [
    { label: 'Mission status?', resp: "Making progress. Stay focused." },
    { label: 'Advice?', resp: gameState.heat > 50 ? "Lay low. Let heat die down." : "Room to operate. Trust your gut." },
    { label: 'Intel?', resp: gameState.intel.length ? `Latest: ${gameState.intel.slice(-1)}` : "Nothing new." },
    { label: 'Need a moment.', resp: fx.garble > 0.1 ? "Easy. Breathe. Not rushed yet." : "You're solid." },
  ];
  const snark = ["I'm your handler, not therapist.", "Save it for debrief.", "Focus, Grey."];
  
  return (
    <div style={{ background: theme.bg.panel, borderColor: theme.chrome.dark }} className="border-b flex-shrink-0">
      <div style={{ borderColor: theme.chrome.dark }} className="px-4 py-2 flex items-center justify-between cursor-pointer border-b active:bg-white/5" onClick={onToggle}>
        <div className="flex items-center gap-3">
          <div style={{ borderColor: theme.chrome.medium, background: `${theme.chrome.dark}40` }} className="w-10 h-10 border flex items-center justify-center">
            <svg viewBox="0 0 40 48" className="w-8 h-8" stroke={theme.chrome.bright} fill="none" strokeWidth="0.8">
              <ellipse cx="20" cy="16" rx="12" ry="14"/><ellipse cx="20" cy="16" rx="8" ry="10"/>
              <line x1="8" y1="16" x2="32" y2="16"/><line x1="20" y1="2" x2="20" y2="30"/>
            </svg>
          </div>
          <div>
            <div style={{ color: theme.chrome.bright }} className="font-mono text-sm">SLOANE</div>
            <div style={{ color: theme.chrome.dim }} className="font-mono text-xs">{fx.garble > 0.2 ? '▓UNSTABLE▓' : 'LINK ACTIVE'}</div>
          </div>
        </div>
        <span style={{ color: theme.chrome.dim }} className="font-mono text-xs select-none">{expanded ? '[-]' : '[+]'}</span>
      </div>
      
      <div className={`transition-all duration-300 overflow-hidden ${expanded ? 'max-h-96' : 'max-h-16'}`}>
        <div className="px-4 py-3">
          <div style={{ color: theme.text.primary }} className="text-sm leading-relaxed font-mono">
            {fx.garble > 0.3 && <span style={{ color: theme.accent.warning }}>[INTERFERENCE] </span>}
            {displayed}{isTyping && <span style={{ background: theme.chrome.bright }} className="inline-block w-2 h-4 ml-1 animate-pulse"/>}
          </div>
        </div>
        
        {expanded && (
          <div style={{ borderColor: theme.chrome.dark }} className="px-4 pb-3 border-t pt-3">
            {chatting ? (
              <div className="space-y-2">
                {options.map((o, i) => (
                  <button key={i} onClick={() => { onConverse(o.resp); setChatting(false); }}
                    style={{ borderColor: theme.chrome.dark, color: theme.chrome.medium }}
                    className="w-full p-3 border text-left font-mono text-xs active:bg-white/10">▸ {o.label}</button>
                ))}
                <button onClick={() => { onConverse(snark[Math.floor(Math.random() * snark.length)]); setChatting(false); }}
                  style={{ color: theme.chrome.dim }} className="w-full p-3 font-mono text-xs italic">▸ [Just checking...]</button>
              </div>
            ) : (
              <button onClick={() => setChatting(true)} style={{ borderColor: theme.chrome.medium, color: theme.chrome.bright }}
                className="w-full py-3 border font-mono text-xs active:bg-white/10">[ CONVERSE ]</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ============ ENHANCED MAP PANEL ============
const MapPanel = ({ rooms, currentRoom, onRoomClick, expanded, onToggle, theme }) => {
  const [detail, setDetail] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastTouchDist, setLastTouchDist] = useState(0);
  const mapRef = useRef(null);
  
  const room = rooms[currentRoom];
  
  // Room flavor text
  const textures = {
    server_a: '░▒▓ Servers hum. Cold air.',
    server_b: '█▓▒ Primary data center.',
    corridor: '│ │ Long sightlines. Patrol.',
    vault_ante: '╔══╗ Reinforced. Guard post.',
    vault: '▣▣▣ Deposit boxes. Target.',
    entry: '═══ Service corridor. Start.',
  };

  // Touch handlers for pan/zoom
  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[1].clientX - e.touches[0].clientX,
        e.touches[1].clientY - e.touches[0].clientY
      );
      setLastTouchDist(dist);
    }
  }, [pan]);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    if (e.touches.length === 1 && isDragging) {
      setPan({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[1].clientX - e.touches[0].clientX,
        e.touches[1].clientY - e.touches[0].clientY
      );
      if (lastTouchDist > 0) {
        const scale = dist / lastTouchDist;
        setZoom(z => Math.min(3, Math.max(0.5, z * scale)));
      }
      setLastTouchDist(dist);
    }
  }, [isDragging, dragStart, lastTouchDist]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setLastTouchDist(0);
  }, []);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Calculate viewBox based on rooms
  const visibleRooms = Object.values(rooms).filter(r => r.visibility !== 'hidden');
  const minX = Math.min(...visibleRooms.map(r => r.x)) - 50;
  const maxX = Math.max(...visibleRooms.map(r => r.x)) + 50;
  const minY = Math.min(...visibleRooms.map(r => r.y)) - 30;
  const maxY = Math.max(...visibleRooms.map(r => r.y)) + 30;
  
  return (
    <div style={{ background: theme.bg.panel, borderColor: theme.chrome.dark }} className="border-b flex-shrink-0">
      <div className="px-4 py-2 flex justify-between items-center cursor-pointer active:bg-white/5" onClick={onToggle}>
        <span style={{ color: theme.chrome.medium }} className="font-mono text-xs">MAP // {room?.name}</span>
        <div className="flex items-center gap-3">
          {expanded && (
            <div className="flex gap-1">
              <button onClick={(e) => { e.stopPropagation(); setZoom(z => Math.min(3, z * 1.3)); }}
                style={{ color: theme.chrome.dim }} className="w-6 h-6 font-mono text-xs border border-current active:bg-white/10">+</button>
              <button onClick={(e) => { e.stopPropagation(); setZoom(z => Math.max(0.5, z / 1.3)); }}
                style={{ color: theme.chrome.dim }} className="w-6 h-6 font-mono text-xs border border-current active:bg-white/10">-</button>
              <button onClick={(e) => { e.stopPropagation(); resetView(); }}
                style={{ color: theme.chrome.dim }} className="w-6 h-6 font-mono text-xs border border-current active:bg-white/10">⌂</button>
            </div>
          )}
          <span style={{ color: theme.chrome.dim }} className="font-mono text-xs select-none">{expanded ? '[-]' : '[+]'}</span>
        </div>
      </div>
      
      <div className={`transition-all duration-300 overflow-hidden ${expanded ? 'max-h-80' : 'max-h-0'}`}>
        <div className="px-2 pb-3">
          {/* Map Container with touch handlers */}
          <div 
            ref={mapRef}
            className="relative overflow-hidden touch-none"
            style={{ height: '180px', background: theme.bg.secondary, border: `1px solid ${theme.chrome.dark}` }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Grid overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-10"
              style={{
                backgroundImage: `linear-gradient(${theme.chrome.dim}40 1px, transparent 1px), linear-gradient(90deg, ${theme.chrome.dim}40 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }}
            />
            
            <svg 
              viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
              className="w-full h-full"
              style={{ 
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                transformOrigin: 'center'
              }}
            >
              {/* Connection lines - thin, dashed */}
              {Object.values(rooms).filter(r => r.visibility !== 'hidden').map(r =>
                r.exits?.filter(e => rooms[e]?.visibility !== 'hidden').map(exitId => {
                  const t = rooms[exitId]; 
                  if (!t) return null;
                  const isAccessible = room?.exits?.includes(exitId) || room?.exits?.includes(r.id);
                  return (
                    <line 
                      key={`${r.id}-${exitId}`} 
                      x1={r.x} y1={r.y} 
                      x2={t.x} y2={t.y}
                      stroke={isAccessible ? theme.chrome.medium : theme.chrome.dark}
                      strokeWidth="0.5"
                      strokeDasharray="3,3"
                      opacity={isAccessible ? 0.8 : 0.3}
                    />
                  );
                })
              )}
              
              {/* Room nodes */}
              {Object.values(rooms).filter(r => r.visibility !== 'hidden').map(r => {
                const isCurrent = r.id === currentRoom;
                const canGo = room?.exits?.includes(r.id);
                const isSuspected = r.visibility === 'suspected';
                const isCleared = r.cleared;
                
                // Determine room color
                let strokeColor = theme.chrome.medium;
                if (isCurrent) strokeColor = theme.chrome.bright;
                else if (isSuspected) strokeColor = theme.chrome.dark;
                else if (isCleared) strokeColor = theme.accent.success;
                
                return (
                  <g 
                    key={r.id} 
                    onClick={() => canGo ? onRoomClick(r.id) : setDetail(detail === r.id ? null : r.id)} 
                    className="cursor-pointer"
                    style={{ touchAction: 'manipulation' }}
                  >
                    {/* Room box - thin border */}
                    <rect 
                      x={r.x - 28} y={r.y - 10} 
                      width="56" height="20"
                      fill={isCurrent ? `${theme.chrome.dark}40` : 'transparent'}
                      stroke={strokeColor}
                      strokeWidth={isCurrent ? 1 : 0.5}
                      strokeDasharray={isSuspected ? '2,2' : 'none'}
                      rx="1"
                    />
                    
                    {/* Current room indicator - pulsing dot */}
                    {isCurrent && (
                      <circle cx={r.x - 20} cy={r.y} r="2" fill={theme.chrome.bright}>
                        <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
                      </circle>
                    )}
                    
                    {/* Accessible room indicator */}
                    {canGo && !isCurrent && (
                      <circle cx={r.x + 20} cy={r.y} r="1.5" fill={theme.accent.cyan} opacity="0.8">
                        <animate attributeName="r" values="1.5;2.5;1.5" dur="2s" repeatCount="indefinite"/>
                      </circle>
                    )}
                    
                    {/* Cleared checkmark */}
                    {isCleared && !isCurrent && (
                      <text x={r.x + 22} y={r.y + 3} fill={theme.accent.success} fontSize="8" fontFamily="monospace">✓</text>
                    )}
                    
                    {/* Room label */}
                    <text 
                      x={r.x} y={r.y + 3} 
                      textAnchor="middle" 
                      fill={isSuspected ? theme.chrome.dark : theme.chrome.medium} 
                      fontSize="5" 
                      fontFamily="monospace"
                      style={{ userSelect: 'none' }}
                    >
                      {isSuspected ? '[???]' : r.name?.substring(0, 8)}
                    </text>
                  </g>
                );
              })}
            </svg>
            
            {/* Zoom level indicator */}
            <div className="absolute bottom-1 left-2 font-mono text-xs" style={{ color: theme.chrome.dark }}>
              {Math.round(zoom * 100)}%
            </div>
          </div>
          
          {/* Room detail panel */}
          {detail && rooms[detail] && (
            <div style={{ background: theme.bg.secondary, borderColor: theme.chrome.dark }} className="border border-t-0 p-2">
              <div className="flex justify-between items-center">
                <span style={{ color: theme.chrome.medium }} className="font-mono text-xs">{rooms[detail].name}</span>
                {rooms[detail].cleared && <span style={{ color: theme.accent.success }} className="font-mono text-xs">CLEAR</span>}
              </div>
              <div style={{ color: theme.chrome.dim }} className="font-mono text-xs mt-1">{textures[detail] || rooms[detail].narrative?.substring(0, 40)}</div>
            </div>
          )}
          
          {/* Legend */}
          <div className="flex justify-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: theme.chrome.bright }}/>
              <span style={{ color: theme.chrome.dim }} className="font-mono text-xs">YOU</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: theme.accent.cyan }}/>
              <span style={{ color: theme.chrome.dim }} className="font-mono text-xs">GO</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2" style={{ border: `1px dashed ${theme.chrome.dark}` }}/>
              <span style={{ color: theme.chrome.dim }} className="font-mono text-xs">???</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ COMMAND LINE ============
const CommandLine = ({ actions, onCommand, theme }) => {
  const [verb, setVerb] = useState(null);
  const verbs = [{ id: 'LOOK', icon: '◎' }, { id: 'INSPECT', icon: '⌕' }, { id: 'TALK', icon: '◈' }, { id: 'ACT', icon: '⚙' }];
  
  const getOpts = (v) => {
    switch(v) {
      case 'LOOK': return [{ label: 'Survey', action: 'look' }, ...actions.filter(a => a.type === 'search').map(a => ({ label: 'Search', challenge: a }))];
      case 'INSPECT': return [...actions.filter(a => a.type === 'terminal').map(a => ({ label: 'Terminal', challenge: a })),
                              ...actions.filter(a => a.type === 'puzzle').map(a => ({ label: 'Lock', challenge: a }))];
      case 'TALK': return actions.filter(a => a.type === 'human').map(a => ({ label: a.npc?.name || 'Target', challenge: a }));
      case 'ACT': return [...actions.filter(a => a.type === 'surveillance').map(a => ({ label: 'Move', challenge: a })),
                         { label: 'Wait', action: 'wait' }, { label: 'Inventory', action: 'inventory' }];
      default: return [];
    }
  };
  
  const opts = verb ? getOpts(verb) : [];
  
  return (
    <div style={{ background: theme.bg.panel, borderColor: theme.chrome.dark }} className="border-t flex-shrink-0">
      <div className="flex">
        {verbs.map(v => (
          <button key={v.id} onClick={() => setVerb(verb === v.id ? null : v.id)}
            style={{ borderColor: theme.chrome.dark, color: verb === v.id ? theme.chrome.bright : theme.chrome.medium,
                     background: verb === v.id ? `${theme.chrome.dark}60` : 'transparent' }}
            className="flex-1 py-3 border-r last:border-r-0 font-mono text-xs active:bg-white/10 select-none"
            >
            <div className="text-lg">{v.icon}</div><div>{v.id}</div>
          </button>
        ))}
      </div>
      {verb && opts.length > 0 && (
        <div className="p-3 space-y-2">
          {opts.map((o, i) => (
            <button key={i} onClick={() => { onCommand(o); setVerb(null); }}
              style={{ borderColor: theme.chrome.dark, color: theme.chrome.medium }}
              className="w-full p-3 border text-left font-mono text-xs active:bg-white/10">▸ {o.label}</button>
          ))}
        </div>
      )}
    </div>
  );
};

// ============ STATUS PANEL ============
const StatusPanel = ({ gameState, theme }) => {
  const fx = getPulseEffects(gameState.pulse);
  const heat = gameState.heat > 70 ? 'HUNTED' : gameState.heat > 40 ? 'NOTICED' : 'GHOST';
  const cover = gameState.cover > 70 ? 'SOLID' : gameState.cover > 40 ? 'THIN' : 'BLOWN';
  
  const Bar = ({ label, value, max, status, col }) => (
    <div className="flex-1 px-2">
      <div className="flex justify-between mb-1">
        <span style={{ color: theme.chrome.dim }} className="font-mono text-xs">{label}</span>
        <span style={{ color: theme.accent[col] }} className="font-mono text-xs">{status}</span>
      </div>
      <div style={{ background: theme.chrome.dark }} className="h-2 rounded">
        <div className="h-full rounded transition-all duration-300" style={{ width: `${(value/max)*100}%`, background: theme.accent[col] }}/>
      </div>
    </div>
  );
  
  return (
    <div style={{ background: theme.bg.panel, borderColor: theme.chrome.dark }} className="border-t px-2 py-3 flex-shrink-0">
      <div className="flex">
        <Bar label="COVER" value={gameState.cover} max={100} status={cover} col={cover === 'SOLID' ? 'success' : cover === 'THIN' ? 'warning' : 'danger'}/>
        <Bar label="HEAT" value={gameState.heat} max={100} status={heat} col={heat === 'GHOST' ? 'success' : heat === 'NOTICED' ? 'warning' : 'danger'}/>
        <Bar label="PULSE" value={gameState.pulse} max={180} status={fx.label} col={fx.color}/>
      </div>
      {(fx.garble > 0.1 || gameState.heat > 60) && (
        <div style={{ color: theme.accent.warning }} className="text-center font-mono text-xs mt-2">
          {fx.garble > 0.1 && '⚠ PULSE AFFECTING LINK '}{gameState.heat > 60 && '⚠ HIGH HEAT'}
        </div>
      )}
    </div>
  );
};

// ============ CHALLENGES ============
const HumanChallenge = ({ challenge, onAction, onComplete, gameState, theme }) => {
  const [npc, setNpc] = useState({ ...challenge.npc, composure: challenge.npc.composure || 70, suspicion: challenge.npc.suspicion || 30, compliance: challenge.npc.compliance || 20 });
  const [momentum, setMomentum] = useState(0);
  const [result, setResult] = useState(null);
  const fx = getPulseEffects(gameState.pulse);
  
  const acts = [{ id: 'RAPPORT', mod: 2 }, { id: 'PRESSURE', mod: -1 }, { id: 'DECEIVE', mod: 0 }, { id: 'INTIMIDATE', mod: -2 }];
  
  const doAction = (act) => {
    const roll = rollDice(act.mod + Math.floor(momentum / 2), 10 + Math.floor(npc.suspicion / 10), fx.penalty);
    let n = { ...npc }, m = momentum, res = { heat: 5, pulse: 10 };
    
    if (roll.isCrit) { n.compliance = Math.min(100, n.compliance + 35); m += 3; res = { heat: 0, pulse: -5 }; }
    else if (roll.isFumble) { n.suspicion = Math.min(100, n.suspicion + 40); m -= 3; res = { heat: 25, pulse: 30 }; }
    else if (roll.success) {
      if (act.id === 'RAPPORT') n.compliance += 15;
      else if (act.id === 'PRESSURE') n.composure -= 25;
      else if (act.id === 'DECEIVE') n.compliance += 20;
      else { n.composure -= 35; n.compliance += 20; res.heat = 15; }
      m += 1;
    } else { n.suspicion = Math.min(100, n.suspicion + 15); m -= 1; res = { heat: 15, pulse: 15 }; }
    
    setNpc(n); setMomentum(m); setResult({ act: act.id, roll }); onAction(act.id, res);
    setTimeout(() => setResult(null), 2000);
    
    if (n.compliance >= 80) setTimeout(() => onComplete('compliance'), 1500);
    else if (n.composure <= 10) setTimeout(() => onComplete('broken'), 1500);
    else if (n.suspicion >= 90) setTimeout(() => onComplete('blown'), 1500);
  };
  
  const tell = npc.composure < 30 ? "Shaking. Won't meet your eyes." : npc.suspicion > 60 ? "Hand near radio." : npc.compliance > 50 ? "Opening up." : "Guarded.";
  
  return (
    <div className="p-3">
      <div style={{ borderColor: theme.chrome.dark }} className="border p-3 mb-3">
        <div className="flex items-center gap-3 mb-3">
          <div style={{ borderColor: theme.chrome.medium }} className="w-12 h-14 border flex items-center justify-center text-2xl">👤</div>
          <div>
            <div style={{ color: theme.chrome.bright }} className="font-mono text-sm">{npc.name}</div>
            <div style={{ color: theme.chrome.dim }} className="font-mono text-xs">{npc.role}</div>
          </div>
        </div>
        {['COMPOSURE', 'SUSPICION', 'COMPLIANCE'].map((stat, i) => {
          const val = stat === 'COMPOSURE' ? npc.composure : stat === 'SUSPICION' ? npc.suspicion : npc.compliance;
          const bad = (stat === 'COMPOSURE' && val < 30) || (stat === 'SUSPICION' && val > 60);
          const good = stat === 'COMPLIANCE' && val > 50;
          return (
            <div key={stat} className="mb-2">
              <div className="flex justify-between mb-1">
                <span style={{ color: theme.chrome.dim }} className="font-mono text-xs">{stat}</span>
                <span style={{ color: bad ? theme.accent.danger : good ? theme.accent.success : theme.chrome.medium }} className="font-mono text-xs">{val}%</span>
              </div>
              <div style={{ background: theme.chrome.dark }} className="h-1.5 rounded">
                <div className="h-full rounded transition-all" style={{ width: `${val}%`, background: bad ? theme.accent.danger : good ? theme.accent.success : theme.chrome.medium }}/>
              </div>
            </div>
          );
        })}
        <div style={{ color: theme.text.dim }} className="text-xs italic mt-2">{tell}</div>
      </div>
      
      {result && (
        <div style={{ background: result.roll.success ? `${theme.accent.success}20` : `${theme.accent.danger}20`, borderColor: result.roll.success ? theme.accent.success : theme.accent.danger }}
          className="border p-2 mb-3 text-center font-mono text-xs">
          {result.act}: {result.roll.isCrit ? 'CRIT! ' : result.roll.isFumble ? 'FUMBLE! ' : ''}{result.roll.success ? 'SUCCESS' : 'FAILED'} (Roll: {result.roll.roll})
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-2">
        {acts.map(a => (
          <button key={a.id} onClick={() => doAction(a)} style={{ borderColor: theme.chrome.dark, color: theme.chrome.medium }}
            className="p-3 border font-mono text-xs active:bg-white/10">[{a.id}]</button>
        ))}
      </div>
      {fx.penalty < 0 && <div style={{ color: theme.accent.warning }} className="text-center font-mono text-xs mt-2">⚠ Pulse affecting rolls ({fx.penalty})</div>}
    </div>
  );
};

const TerminalChallenge = ({ onAction, onComplete, theme }) => {
  const [seq, setSeq] = useState([]);
  const [target] = useState(() => Array.from({length: 4}, () => Math.floor(Math.random() * 6)));
  const [attempts, setAttempts] = useState(3);
  const [feedback, setFeedback] = useState([]);
  const [status, setStatus] = useState('READY');
  const syms = ['◇', '△', '○', '□', '⬡', '✕'];
  
  const input = (i) => {
    if (seq.length >= 4) return;
    const ns = [...seq, i];
    setSeq(ns);
    if (ns.length === 4) {
      const fb = ns.map((s, idx) => s === target[idx] ? 'Y' : target.includes(s) ? 'P' : 'N');
      setFeedback(fb);
      if (fb.every(f => f === 'Y')) {
        setStatus('GRANTED'); onAction('SUCCESS', { heat: 0, pulse: -10 });
        setTimeout(() => onComplete('success'), 1000);
      } else {
        const a = attempts - 1; setAttempts(a); setStatus(a > 0 ? 'DENIED' : 'LOCKOUT');
        onAction('ATTEMPT', { heat: 10, pulse: 15 });
        if (a <= 0) setTimeout(() => onComplete('lockout'), 1000);
        else setTimeout(() => { setSeq([]); setFeedback([]); setStatus('READY'); }, 1500);
      }
    }
  };
  
  return (
    <div className="p-4">
      <div style={{ color: status === 'GRANTED' ? theme.accent.success : status.includes('DENIED') || status === 'LOCKOUT' ? theme.accent.danger : theme.chrome.medium }}
        className="text-center font-mono text-xs mb-3">TERMINAL: {status} {attempts < 3 && status === 'READY' && `// ${attempts} LEFT`}</div>
      <div className="flex justify-center gap-2 mb-4">
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            borderColor: feedback[i] === 'Y' ? theme.accent.success : feedback[i] === 'P' ? theme.accent.warning : feedback[i] === 'N' ? theme.accent.danger : theme.chrome.dark,
            color: feedback[i] === 'Y' ? theme.accent.success : feedback[i] === 'P' ? theme.accent.warning : feedback[i] === 'N' ? theme.accent.danger : theme.chrome.bright
          }} className="w-12 h-12 border-2 flex items-center justify-center text-xl font-mono">
            {seq[i] !== undefined ? syms[seq[i]] : '?'}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-6 gap-1 mb-3">
        {syms.map((s, i) => (
          <button key={i} onClick={() => input(i)} disabled={seq.length >= 4}
            style={{ borderColor: theme.chrome.dark, color: theme.chrome.bright }}
            className="py-3 border text-lg active:bg-white/10 disabled:opacity-30">{s}</button>
        ))}
      </div>
      <button onClick={() => { setSeq([]); setFeedback([]); }} style={{ borderColor: theme.chrome.dark, color: theme.chrome.dim }}
        className="w-full py-2 border font-mono text-xs active:bg-white/10">[CLEAR]</button>
    </div>
  );
};

const SurveillanceChallenge = ({ onAction, onComplete, theme }) => {
  const [timer, setTimer] = useState(0);
  const [moved, setMoved] = useState(false);
  
  useEffect(() => {
    const int = setInterval(() => setTimer(t => (t + 1) % 24), 400);
    return () => clearInterval(int);
  }, []);
  
  const phase = Math.floor(timer / 6);
  const window = phase === 2;
  const phases = ['PATROL NEAR', 'APPROACHING', 'BLIND SPOT', 'DEPARTING'];
  
  const move = () => {
    if (moved) return;
    setMoved(true);
    if (window) { onAction('SUCCESS', { heat: -5, pulse: 10 }); setTimeout(() => onComplete('passed'), 800); }
    else { onAction('DETECTED', { heat: 40, pulse: 50 }); setTimeout(() => onComplete('detected'), 800); }
  };
  
  return (
    <div className="p-4">
      <div style={{ color: window ? theme.accent.success : theme.accent.danger }} className="text-center font-mono text-xs mb-4 animate-pulse">{phases[phase]}</div>
      <div style={{ borderColor: theme.chrome.dark, background: theme.bg.secondary }} className="border h-16 mb-4 relative">
        <div className="absolute w-4 h-4 rounded-full transition-all" style={{ left: `${10 + phase * 25}%`, top: '50%', transform: 'translateY(-50%)',
          background: window ? theme.accent.success : theme.accent.danger, boxShadow: `0 0 10px ${window ? theme.accent.success : theme.accent.danger}` }}/>
        {window && <div className="absolute inset-0 flex items-center justify-center">
          <span style={{ color: theme.accent.success, borderColor: theme.accent.success }} className="border px-3 py-1 font-mono text-xs">GO</span>
        </div>}
      </div>
      <div className="flex justify-center gap-2 mb-4">
        {phases.map((_, i) => <div key={i} className="w-3 h-3 rounded-full" style={{ background: i === phase ? (window ? theme.accent.success : theme.accent.danger) : theme.chrome.dark }}/>)}
      </div>
      <button onClick={move} disabled={moved} style={{ borderColor: window ? theme.accent.success : theme.accent.danger, color: window ? theme.accent.success : theme.accent.danger }}
        className="w-full py-3 border font-mono text-sm disabled:opacity-50 active:bg-white/10">{moved ? (window ? '[CLEAR]' : '[DETECTED]') : '[MOVE]'}</button>
    </div>
  );
};

const PuzzleChallenge = ({ challenge, onAction, onComplete, theme }) => {
  const [dials, setDials] = useState([0, 0, 0]);
  const target = challenge.combination || [3, 7, 1];
  const [status, setStatus] = useState('LOCKED');
  
  const adj = (i, d) => setDials(p => { const n = [...p]; n[i] = (n[i] + d + 10) % 10; return n; });
  const tryOpen = () => {
    if (dials.every((d, i) => d === target[i])) {
      setStatus('UNLOCKED'); onAction('UNLOCK', { heat: 0, pulse: -5 }); setTimeout(() => onComplete('unlocked'), 1000);
    } else { setStatus('WRONG'); onAction('WRONG', { heat: 8, pulse: 12 }); setTimeout(() => setStatus('LOCKED'), 1500); }
  };
  
  return (
    <div className="p-4">
      <div style={{ color: status === 'UNLOCKED' ? theme.accent.success : status === 'WRONG' ? theme.accent.danger : theme.chrome.medium }}
        className="text-center font-mono text-xs mb-4">LOCK: {status}</div>
      <div className="flex justify-center gap-4 mb-4">
        {dials.map((v, i) => (
          <div key={i} className="flex flex-col items-center">
            <button onClick={() => adj(i, 1)} style={{ borderColor: theme.chrome.dark, color: theme.chrome.medium }} className="w-12 h-10 border active:bg-white/10">▲</button>
            <div style={{ borderColor: theme.chrome.medium, color: theme.chrome.bright }} className="w-12 h-14 border-x flex items-center justify-center text-2xl font-mono">{v}</div>
            <button onClick={() => adj(i, -1)} style={{ borderColor: theme.chrome.dark, color: theme.chrome.medium }} className="w-12 h-10 border active:bg-white/10">▼</button>
          </div>
        ))}
      </div>
      {challenge.hint && <div style={{ color: theme.chrome.dim }} className="text-center font-mono text-xs mb-4 italic">HINT: {challenge.hint}</div>}
      <button onClick={tryOpen} style={{ borderColor: theme.chrome.medium, color: theme.chrome.bright }} className="w-full py-3 border font-mono text-sm active:bg-white/10">[OPEN]</button>
    </div>
  );
};

const SearchChallenge = ({ challenge, onAction, onComplete, gameState, theme }) => {
  const [searched, setSearched] = useState([]);
  const [found, setFound] = useState([]);
  const fx = getPulseEffects(gameState.pulse);
  const spots = challenge.searchSpots || [
    { id: 'desk', name: 'DESK', hasItem: true, item: { name: 'KEYCARD', type: 'key' }, dc: 8 },
    { id: 'cabinet', name: 'CABINET', hasItem: true, item: { name: 'INTEL', type: 'intel' }, dc: 10 },
    { id: 'safe', name: 'SAFE', hasItem: true, item: { name: 'DOCS', type: 'objective' }, dc: 14 },
  ];
  
  const search = (s) => {
    if (searched.includes(s.id)) return;
    const roll = rollDice(2, s.dc, fx.penalty);
    setSearched(p => [...p, s.id]);
    if (roll.success && s.hasItem) {
      setFound(p => [...p, s.item]); onAction('FOUND', { heat: 3, pulse: 5 });
      if (s.item.type === 'objective') setTimeout(() => onComplete('objective', s.item), 1000);
    } else onAction('SEARCH', { heat: 5, pulse: 8 });
  };
  
  return (
    <div className="p-4">
      <div className="flex justify-between mb-3">
        <span style={{ color: theme.chrome.dim }} className="font-mono text-xs">SEARCH</span>
        <span style={{ color: theme.chrome.medium }} className="font-mono text-xs">{found.length} FOUND</span>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {spots.map(s => {
          const done = searched.includes(s.id);
          const got = done && found.some(f => f.name === s.item?.name);
          return (
            <button key={s.id} onClick={() => search(s)} disabled={done}
              style={{ borderColor: got ? theme.accent.success : done ? theme.chrome.dark : theme.chrome.medium, color: got ? theme.accent.success : done ? theme.chrome.dark : theme.chrome.medium }}
              className="p-3 border font-mono text-xs disabled:cursor-default active:bg-white/10">{s.name}{got && ' ✓'}</button>
          );
        })}
      </div>
      {found.length > 0 && (
        <div style={{ borderColor: theme.chrome.dark }} className="border-t pt-3">
          <div style={{ color: theme.chrome.dim }} className="font-mono text-xs mb-2">RECOVERED:</div>
          <div className="flex flex-wrap gap-2">
            {found.map((f, i) => <span key={i} style={{ borderColor: theme.chrome.medium, color: theme.chrome.bright }} className="px-2 py-1 border font-mono text-xs">{f.name}</span>)}
          </div>
        </div>
      )}
    </div>
  );
};

// ============ DOSSIER ============
const Dossier = ({ mission, onBegin, theme }) => {
  const [sec, setSec] = useState(0);
  const secs = [
    { title: 'BRIEFING', content: mission.briefing },
    { title: 'OBJECTIVE', content: mission.objective },
    { title: 'PERSONNEL', content: mission.personnel },
    { title: 'HAZARDS', content: mission.hazards },
    { title: 'HANDLER', content: mission.sloaneNotes }
  ];
  const { displayed, isTyping, skip } = useTypewriter(secs[sec].content, 18, 0);
  const advance = () => { if (isTyping) skip(); else if (sec < secs.length - 1) setSec(s => s + 1); else onBegin(); };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 safe-area-inset" style={{ background: theme.bg.primary }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div style={{ color: theme.chrome.dim }} className="font-mono text-xs mb-2">▰▰▰ CLASSIFIED ▰▰▰</div>
          <div style={{ color: theme.chrome.bright }} className="font-mono text-xl">{mission.codename}</div>
        </div>
        <div style={{ background: theme.bg.panel, borderColor: theme.chrome.dark }} className="border p-4 mb-4">
          <div style={{ color: theme.chrome.medium, borderColor: theme.chrome.dark }} className="font-mono text-xs mb-3 pb-2 border-b">{secs[sec].title}</div>
          <div style={{ color: theme.text.primary }} className="font-mono text-sm leading-relaxed min-h-28">
            {displayed}{isTyping && <span style={{ background: theme.chrome.bright }} className="inline-block w-2 h-4 ml-1 animate-pulse"/>}
          </div>
        </div>
        <div className="flex justify-center gap-2 mb-4">
          {secs.map((_, i) => <div key={i} className="w-2 h-2 rounded-full" style={{ background: i <= sec ? theme.chrome.bright : theme.chrome.dark }}/>)}
        </div>
        <button onClick={advance} style={{ borderColor: theme.chrome.medium, color: theme.chrome.bright }} className="w-full py-4 border font-mono text-sm active:bg-white/10">
          {isTyping ? '[SKIP]' : sec < secs.length - 1 ? '[CONTINUE]' : '[BEGIN]'}
        </button>
      </div>
    </div>
  );
};

// ============ DATA ============
const MISSION = {
  codename: 'OPERATION: GLASS SHADOW',
  briefing: "Meridian Capital holds evidence of market manipulation. Air-gapped servers in their secure wing.",
  objective: "Retrieve transaction records. Secondary: identify SEC contact. Leave no trace.",
  personnel: "Marcus Webb, Security Chief. Diana Chen, Night Manager. Unknown guard count.",
  hazards: "Biometric locks. Pressure sensors. Webb checks at 2300 and 0100.",
  sloaneNotes: "Grey, Webb's no amateur. Chen might be an asset. I'll be in your ear."
};

const ROOMS = {
  entry: { id: 'entry', name: 'ENTRY', x: 40, y: 80, visibility: 'known', cleared: true, narrative: "Service corridor. Your way in.", intel: ['Keycard needed'], challenges: [], exits: ['server_a'] },
  server_a: { id: 'server_a', name: 'SERVER A', x: 100, y: 40, visibility: 'known', cleared: false, narrative: "Servers humming. Technician at terminal.", intel: ['One tech', 'Terminal access'],
    challenges: [{ id: 'tech', type: 'human', status: 'active', npc: { name: 'ALAN PRICE', role: 'TECH', composure: 65, suspicion: 20, compliance: 15 }},
                 { id: 'term', type: 'terminal', status: 'locked', requires: 'tech' }],
    exits: ['entry', 'server_b', 'corridor'], exitVisibility: { corridor: 'suspected' } },
  server_b: { id: 'server_b', name: 'SERVER B', x: 180, y: 40, visibility: 'known', cleared: false, narrative: "Primary data center.", intel: ['Hidden safe'],
    challenges: [{ id: 'srch', type: 'search', status: 'active', searchSpots: [{ id: 'rack', name: 'RACK', hasItem: false, dc: 8 }, { id: 'desk', name: 'DESK', hasItem: true, item: { name: 'NOTES', type: 'intel' }, dc: 6 }]}],
    exits: ['server_a', 'corridor'], exitVisibility: { corridor: 'suspected' } },
  corridor: { id: 'corridor', name: 'CORRIDOR', x: 240, y: 70, visibility: 'suspected', cleared: false, narrative: "Patrol route. Polished floors.", intel: ['12-min cycles'],
    challenges: [{ id: 'surv', type: 'surveillance', status: 'active' }], exits: ['server_a', 'server_b', 'vault_ante'], exitVisibility: { vault_ante: 'suspected' } },
  vault_ante: { id: 'vault_ante', name: 'ANTECHAMBER', x: 180, y: 100, visibility: 'hidden', cleared: false, narrative: "Vault door dominates. Guard watches.", intel: ['3-digit combo'],
    challenges: [{ id: 'guard', type: 'human', status: 'active', npc: { name: 'VICTOR', role: 'SECURITY', composure: 80, suspicion: 40, compliance: 5 }},
                 { id: 'lock', type: 'puzzle', status: 'locked', requires: 'guard', combination: [3,7,1], hint: "Badge reversed" }],
    exits: ['corridor', 'vault'], exitVisibility: { vault: 'hidden' } },
  vault: { id: 'vault', name: 'VAULT', x: 180, y: 140, visibility: 'hidden', cleared: false, narrative: "Deposit boxes. The target is here.", intel: ['Target in box'],
    challenges: [{ id: 'final', type: 'search', status: 'active', searchSpots: [{ id: 'b1', name: 'BOX 1147', hasItem: false, dc: 8 }, { id: 'b2', name: 'BOX 1148', hasItem: true, item: { name: 'TARGET DOCS', type: 'objective' }, dc: 10 }]}],
    exits: ['vault_ante'] }
};

const SLOANE = {
  entry: "You're in. Server A ahead—one signature.", server_a: "Alan Price. Debt, hates his boss. Persuadable.", server_b: "Primary servers. Search carefully.",
  corridor: "Patrol route. 8-second window.", vault_ante: "Victor. Ex-military. Won't scare easy.", vault: "Find the docs. We're done.",
  wait: "Taking a breather? Smart.", look: "Nothing new. Stay sharp."
};

// ============ MAIN ============
export default function GlassShadowGame() {
  const [themeKey, setThemeKey] = useState('silver');
  const theme = THEMES[themeKey];
  const [phase, setPhase] = useState('dossier');
  const [rooms, setRooms] = useState(ROOMS);
  const [curr, setCurr] = useState('entry');
  const [challenge, setChallenge] = useState(null);
  const [sloane, setSloane] = useState('');
  const [sloaneExp, setSloaneExp] = useState(true);
  const [mapExp, setMapExp] = useState(true);
  const [showInv, setShowInv] = useState(false);
  const [gs, setGs] = useState({ cover: 90, heat: 5, pulse: 68, inventory: [], intel: [], objectives: [] });
  
  const room = rooms[curr];
  const actions = useMemo(() => room?.challenges.filter(c => {
    if (c.status === 'complete') return false;
    if (c.requires) return room.challenges.find(ch => ch.id === c.requires)?.status === 'complete';
    return c.status === 'active';
  }) || [], [room]);
  
  // Pulse recovery over time
  useEffect(() => { 
    if (phase === 'active') { 
      const int = setInterval(() => setGs(p => ({ ...p, pulse: Math.max(60, p.pulse - 1) })), 3000); 
      return () => clearInterval(int); 
    } 
  }, [phase]);

  // Prevent iOS bounce/overscroll
  useEffect(() => {
    const preventDefault = (e) => {
      if (e.touches.length > 1) return; // Allow pinch zoom on map
      const target = e.target;
      // Allow scrolling in scrollable containers
      if (target.closest('.overflow-auto, .overflow-y-auto')) return;
      e.preventDefault();
    };
    
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    document.addEventListener('touchmove', preventDefault, { passive: false });
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.removeEventListener('touchmove', preventDefault);
    };
  }, []);
  
  const begin = () => { setPhase('active'); setSloane(SLOANE.entry); };
  const goRoom = (id) => {
    const t = rooms[id]; if (!t || t.visibility === 'hidden' || !room?.exits?.includes(id)) return;
    if (t.visibility === 'suspected') setRooms(p => ({ ...p, [id]: { ...p[id], visibility: 'known' }}));
    setCurr(id); setChallenge(null); setSloane(SLOANE[id] || "Analyzing...");
  };
  const cmd = (c) => {
    if (c.action === 'wait') { setGs(p => ({ ...p, pulse: Math.max(60, p.pulse - 15) })); setSloane(SLOANE.wait); return; }
    if (c.action === 'inventory') { setShowInv(true); return; }
    if (c.action === 'look') { setSloane(SLOANE.look); return; }
    if (c.challenge) setChallenge(c.challenge);
  };
  const act = (_, res) => setGs(p => ({ ...p, heat: Math.min(100, Math.max(0, p.heat + (res.heat || 0))), pulse: Math.min(180, Math.max(50, p.pulse + (res.pulse || 0))), cover: Math.max(0, p.cover - (res.heat > 20 ? 15 : 0)) }));
  const complete = (result, item) => {
    const ok = !['fail', 'lockout', 'detected', 'blown'].some(f => result.includes(f));
    setSloane(ok ? "Clean. Keep moving." : "Damn. Adapt.");
    setRooms(p => {
      const u = { ...p[curr] };
      u.challenges = u.challenges.map(c => c.id === challenge.id ? { ...c, status: 'complete' } : c);
      u.challenges = u.challenges.map(c => c.requires === challenge.id && c.status === 'locked' ? { ...c, status: 'active' } : c);
      if (u.challenges.every(c => c.status === 'complete')) {
        u.cleared = true;
        Object.entries(u.exitVisibility || {}).forEach(([e, v]) => { if (p[e]) p[e] = { ...p[e], visibility: v === 'hidden' ? 'suspected' : 'known' }; });
      }
      return { ...p, [curr]: u };
    });
    if (item) {
      setGs(p => ({ ...p, inventory: [...p.inventory, item], objectives: item.type === 'objective' ? [...p.objectives, item.name] : p.objectives }));
      if (item.type === 'objective') setTimeout(() => { setSloane("Package acquired. Get out clean."); setPhase('complete'); }, 2000);
    }
    setChallenge(null);
  };
  const converse = (r) => setSloane(r);
  
  const renderChallenge = () => {
    if (!challenge) return null;
    const p = { challenge, onAction: act, onComplete: complete, gameState: gs, theme };
    switch (challenge.type) {
      case 'human': return <HumanChallenge {...p}/>;
      case 'terminal': return <TerminalChallenge {...p}/>;
      case 'search': return <SearchChallenge {...p}/>;
      case 'surveillance': return <SurveillanceChallenge {...p}/>;
      case 'puzzle': return <PuzzleChallenge {...p}/>;
      default: return null;
    }
  };
  
  if (phase === 'dossier') return <Dossier mission={MISSION} onBegin={begin} theme={theme}/>;
  
  // Victory screen
  if (phase === 'complete') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: theme.bg.primary }}>
        <div className="w-full max-w-md text-center">
          <div style={{ color: theme.accent.success }} className="font-mono text-xs mb-2">▰▰▰ MISSION COMPLETE ▰▰▰</div>
          <div style={{ color: theme.chrome.bright }} className="font-mono text-xl mb-6">GLASS SHADOW</div>
          <div style={{ background: theme.bg.panel, borderColor: theme.chrome.dark }} className="border p-4 mb-4 text-left">
            <div style={{ color: theme.chrome.medium }} className="font-mono text-xs mb-2">DEBRIEF</div>
            <div style={{ color: theme.text.primary }} className="font-mono text-sm space-y-2">
              <div>Cover: <span style={{ color: gs.cover > 50 ? theme.accent.success : theme.accent.warning }}>{gs.cover}%</span></div>
              <div>Heat: <span style={{ color: gs.heat < 50 ? theme.accent.success : theme.accent.warning }}>{gs.heat}%</span></div>
              <div>Items: {gs.inventory.length}</div>
              <div>Objectives: <span style={{ color: theme.accent.success }}>COMPLETE</span></div>
            </div>
          </div>
          <button onClick={() => { setPhase('dossier'); setRooms(ROOMS); setCurr('entry'); setGs({ cover: 90, heat: 5, pulse: 68, inventory: [], intel: [], objectives: [] }); }}
            style={{ borderColor: theme.chrome.medium, color: theme.chrome.bright }}
            className="w-full py-4 border font-mono text-sm active:bg-white/10">[REPLAY]</button>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="w-full max-w-md mx-auto flex flex-col relative overflow-hidden select-none" 
      style={{ 
        background: theme.bg.primary, 
        fontFamily: "'Courier New', monospace",
        height: '100vh',
        height: '100dvh', // Dynamic viewport height for iOS
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-20" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.4) 1px, rgba(0,0,0,0.4) 2px)' }}/>
      
      {/* Theme toggle */}
      <button onClick={() => setThemeKey(t => t === 'silver' ? 'dos' : 'silver')} style={{ color: theme.chrome.dim }} 
        className="absolute top-2 right-2 z-50 font-mono text-xs opacity-50 active:opacity-100 p-2">[{themeKey.toUpperCase()}]</button>
      
      {/* Fixed header panels */}
      <SloanePanel message={sloane} expanded={sloaneExp} onToggle={() => setSloaneExp(!sloaneExp)} onConverse={converse} gameState={gs} theme={theme}/>
      <MapPanel rooms={rooms} currentRoom={curr} onRoomClick={goRoom} expanded={mapExp} onToggle={() => setMapExp(!mapExp)} theme={theme}/>
      
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{ background: theme.bg.panel, WebkitOverflowScrolling: 'touch' }}>
        {challenge ? (
          <div>
            <div style={{ borderColor: theme.chrome.dark }} className="px-4 py-2 border-b flex justify-between sticky top-0" style={{ background: theme.bg.panel }}>
              <span style={{ color: theme.chrome.bright }} className="font-mono text-xs">{challenge.type.toUpperCase()}</span>
              <button onClick={() => setChallenge(null)} style={{ color: theme.chrome.dim }} className="font-mono text-xs p-1 active:bg-white/10">[BACK]</button>
            </div>
            {renderChallenge()}
          </div>
        ) : showInv ? (
          <div className="p-4">
            <div className="flex justify-between mb-3">
              <span style={{ color: theme.chrome.bright }} className="font-mono text-xs">INVENTORY</span>
              <button onClick={() => setShowInv(false)} style={{ color: theme.chrome.dim }} className="font-mono text-xs p-1 active:bg-white/10">[CLOSE]</button>
            </div>
            {gs.inventory.length ? gs.inventory.map((i, idx) => (
              <div key={idx} style={{ borderColor: theme.chrome.dark, color: theme.chrome.medium }} className="border p-3 mb-2 font-mono text-xs">{i.name}</div>
            )) : <div style={{ color: theme.chrome.dim }} className="font-mono text-xs">Empty.</div>}
          </div>
        ) : (
          <div className="p-4">
            <div style={{ color: theme.chrome.dim }} className="font-mono text-xs mb-2">{room?.name} {room?.cleared && <span style={{ color: theme.accent.success }}>// CLEAR</span>}</div>
            <div style={{ color: theme.text.secondary }} className="text-sm mb-4">{room?.narrative}</div>
          </div>
        )}
      </div>
      
      {/* Fixed footer panels */}
      {!challenge && !showInv && <CommandLine actions={actions} onCommand={cmd} theme={theme}/>}
      <StatusPanel gameState={gs} theme={theme}/>
    </div>
  );
}
