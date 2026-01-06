import React, { useState, useEffect, useRef, useCallback } from 'react';

// ============ THEME - Silver/Chrome ============
const THEME = {
  bg: {
    primary: '#0a0a0a',
    secondary: '#0f0f0f',
    panel: 'rgba(10, 10, 10, 0.95)',
    float: 'rgba(12, 12, 12, 0.98)'
  },
  chrome: {
    bright: '#e0e0e0',
    medium: '#888888',
    dim: '#555555',
    dark: '#333333',
    faint: '#222222'
  },
  accent: {
    cyan: '#4a9ebb',
    success: '#5a9a6a',
    warning: '#9a8a4a',
    danger: '#9a5a5a',
  },
  text: {
    primary: '#cccccc',
    secondary: '#888888',
    dim: '#555555'
  }
};

// ============ GLASS SHADOW PROJECT DATA ============
const PROJECT_DATA = {
  name: 'GLASS SHADOW',
  repo: 'github.com/bailey0002/glass-shadow',
  deployedUrl: 'https://s-shadow.vercel.app',
  
  nodes: {
    core: {
      id: 'core',
      name: 'CORE',
      x: 50, y: 40,
      status: 'stable',
      priority: 'low',
      technical: 'Game Engine & State Management',
      files: [
        { path: 'core/engine.js', retrievable: true },
        { path: 'core/state.js', retrievable: true },
        { path: 'core/constants.js', retrievable: true }
      ],
      docs: [{ name: 'Architecture Guide', path: 'docs/architecture.md', retrievable: true }],
      function: 'Game loop with tick-based updates, event bus for inter-system communication, priority evaluation for UI attention hierarchy, central state management with save/load support. Seven-pillar architecture foundation.',
      dependencies: { up: [], down: ['pillars', 'entities'] },
      notes: 'Fully implemented. GameEngine class handles tick loop at 60fps. GameState tracks player, NPCs, mission progress. Event bus uses pub/sub pattern for decoupled communication between systems.',
      lastModified: '2026-01-05',
      testCoverage: 85,
      lintErrors: 0
    },
    
    pillars: {
      id: 'pillars',
      name: 'PILLARS',
      x: 140, y: 25,
      status: 'stable',
      priority: 'low',
      technical: 'Data & Game Systems Layer',
      files: [
        { path: 'pillars/environments.json', retrievable: true },
        { path: 'pillars/equipment.json', retrievable: true },
        { path: 'pillars/vitals.js', retrievable: true },
        { path: 'pillars/actions.js', retrievable: true },
        { path: 'pillars/conditions.js', retrievable: true }
      ],
      docs: [],
      function: 'Pillar 1: Environments (4 rooms with ASCII blueprints). Pillar 2-3: Equipment (17 items including coffee-thermos for Mack). Pillar 4: Vitals tracking (health/stamina/stress/detection). Pillar 5: Action definitions (16 verbs with preconditions). Pillar 6: Status conditions (12 effects with UI modifiers).',
      dependencies: { up: ['core'], down: ['entities'] },
      notes: 'environments.json now includes stairwell-b with alternate keycard path. equipment.json has coffee-thermos and energy-drink for Mack sobriety system. Each action has preconditions, effects, duration, noise level, detection risk.',
      lastModified: '2026-01-05',
      testCoverage: 78,
      lintErrors: 2
    },
    
    entities: {
      id: 'entities',
      name: 'ENTITIES',
      x: 230, y: 40,
      status: 'stable',
      priority: 'low',
      technical: 'Player, NPCs, AI Companions',
      files: [
        { path: 'entities/player.js', retrievable: true },
        { path: 'entities/npc.js', retrievable: true },
        { path: 'entities/sloan.js', retrievable: true },
        { path: 'entities/mack.js', retrievable: true }
      ],
      docs: [{ name: 'Mack Integration', path: 'docs/mack-system.md', retrievable: true }],
      function: 'Player class with inventory, skills, position tracking. NPC class with patrol/guard/worker behaviors, awareness states (unaware→suspicious→alert→hostile), capabilities (call backup, lock doors, sound alarm). Sloan AI companion with LLM hooks. Mack unreliable specialist with sobriety system.',
      dependencies: { up: ['core', 'pillars'], down: ['ui'] },
      notes: 'Mack sobriety affects response quality (0-100 scale). Sloan has scripted lines organized by trigger type plus optional LLM calls. NPC detection is wired into game loop but MAY BE TOO AGGRESSIVE - see deployed node.',
      lastModified: '2026-01-05',
      testCoverage: 72,
      lintErrors: 0
    },
    
    ui: {
      id: 'ui',
      name: 'UI LAYER',
      x: 160, y: 75,
      status: 'needs-work',
      priority: 'medium',
      technical: 'Display, Components, Priorities',
      files: [
        { path: 'ui/display.js', retrievable: true },
        { path: 'ui/map-renderer.js', retrievable: true },
        { path: 'ui/priorities.js', retrievable: true },
        { path: 'ui/modes.js', retrievable: true },
        { path: 'ui/components/action-card.js', retrievable: true },
        { path: 'ui/components/sloan-panel.js', retrievable: true },
        { path: 'ui/components/mack-panel.js', retrievable: true },
        { path: 'ui/components/vitals-hud.js', retrievable: true },
        { path: 'ui/components/environment-view.js', retrievable: true },
        { path: 'ui/components/inventory-panel.js', retrievable: true },
        { path: 'ui/components/map-panel.js', retrievable: true },
        { path: 'ui/components/dialogue-panel.js', retrievable: true },
        { path: 'ui/components/objectives-panel.js', retrievable: true }
      ],
      docs: [],
      function: 'Card state management with expand/collapse/minimize transitions. Canvas-based map rendering with blueprint and overview modes. PriorityManager for attention hierarchy (NPC engagement > environment > self). ModeManager for EXPLORATION/DIALOGUE/COMBAT/STEALTH modes. 9 UI components.',
      dependencies: { up: ['entities'], down: ['entry'] },
      notes: 'ISSUE: Deployed version has different aesthetic (green terminal) vs dev version (silver/chrome). Two parallel codebases exist and need consolidation. priorities.js handles UI focus based on NPC engagement, conditions, objectives.',
      lastModified: '2026-01-05',
      testCoverage: 45,
      lintErrors: 8
    },
    
    entry: {
      id: 'entry',
      name: 'ENTRY',
      x: 80, y: 110,
      status: 'needs-work',
      priority: 'high',
      technical: 'Bootstrap & Styling',
      files: [
        { path: 'index.html', retrievable: true },
        { path: 'main.js', retrievable: true },
        { path: 'styles.css', retrievable: true },
        { path: 'package.json', retrievable: true }
      ],
      docs: [],
      function: 'HTML shell with canvas for map and UI containers. main.js bootstraps GlassShadow class, loads mission JSON via fetch(), instantiates NPCs from templates, wires event bus, runs game loop. styles.css has ~700 lines including card transitions and condition effects (shake, blur, pulse).',
      dependencies: { up: ['ui'], down: ['deployed'] },
      notes: 'JSON import bug was fixed (replaced assert syntax with fetch). Two parallel codebases: 30-file modular build with advanced features vs refined UI version. Need to consolidate into single deployable package.',
      lastModified: '2026-01-05',
      testCoverage: 30,
      lintErrors: 3
    },
    
    deployed: {
      id: 'deployed',
      name: 'DEPLOYED',
      x: 240, y: 110,
      status: 'blocking',
      priority: 'critical',
      technical: 'Vercel Production',
      files: [
        { path: 'vercel.json', retrievable: true },
        { path: '.github/workflows/deploy.yml', retrievable: false }
      ],
      docs: [{ name: 'Deploy Guide', path: 'docs/deployment.md', retrievable: true }],
      function: 'Auto-deployment from GitHub main branch via Vercel. Static site hosting at s-shadow.vercel.app. No backend required (pure client-side JS).',
      dependencies: { up: ['entry'], down: [] },
      notes: 'CRITICAL BUG: Instant mission failure on load. NPC detection triggers immediately causing game over before player can act. Guard patrol logic fires detection check on tick 0. Need to add grace period (3-5 seconds) OR fix detection radius to require line-of-sight OR delay NPC spawning until after intro.',
      lastModified: '2026-01-04',
      testCoverage: 0,
      lintErrors: 0
    },
    
    missions: {
      id: 'missions',
      name: 'MISSIONS',
      x: 300, y: 50,
      status: 'stable',
      priority: 'low',
      technical: 'Mission Data & Scripts',
      files: [
        { path: 'missions/active/mission-001.json', retrievable: true },
        { path: 'missions/mission-template.js', retrievable: true },
        { path: 'scripts/dialogue.json', retrievable: true },
        { path: 'scripts/narration.json', retrievable: true }
      ],
      docs: [],
      function: 'Mission 001 "The Quiet Floor" - infiltrate Meridian Capital after hours, retrieve transaction records from admin terminal. Dialogue trees with persuasion/intimidation skill checks. Room narration with first-entry vs return variants.',
      dependencies: { up: ['pillars'], down: ['entry'] },
      notes: 'Mission includes stairwell-b alternate route (utility box has Level 2 keycard). Win condition: has access-logs + at lobby-main + logs_acquired flag. Lose conditions: health ≤ 0, detection ≥ 100, alarm triggered.',
      lastModified: '2026-01-05',
      testCoverage: 60,
      lintErrors: 0
    }
  },
  
  sessionWraps: [
    {
      id: 'sw1',
      date: '2026-01-04',
      title: 'Architecture & Seven Pillars',
      file: 'SESSION_WRAP_Claude_20260104.md',
      retrievable: true,
      summary: 'Established seven-pillar architecture. Built core engine, state management, environments, equipment, vitals, actions, conditions. Created Sloan AI companion with scripted lines and LLM hooks.'
    },
    {
      id: 'sw2',
      date: '2026-01-04',
      title: 'UI Layer Complete',
      file: 'SESSION_WRAP_20260104.md',
      retrievable: true,
      summary: 'Completed UI layer: PriorityManager, ModeManager, all 8 UI components. Created index.html, main.js, styles.css. Game runnable locally.'
    },
    {
      id: 'sw3',
      date: '2026-01-05',
      title: 'Audit & Mack Integration',
      file: 'SESSION_WRAP_20260105.md',
      retrievable: true,
      summary: 'Comprehensive audit. Fixed JSON import bug. Added Mack character with sobriety system. Added stairwell-b room. Implemented NPC detection, combat, win/lose conditions. Game 98% complete.'
    }
  ],
  
  criticalIssues: [
    {
      id: 'ci1',
      severity: 'critical',
      title: 'Instant Mission Failure',
      description: 'NPC detection fires on tick 0, causing immediate game over before player can act',
      node: 'deployed',
      suggestedFix: 'Add 3-5 second grace period in npc.detectPlayer() OR delay NPC spawning until after intro sequence'
    },
    {
      id: 'ci2',
      severity: 'high',
      title: 'Codebase Divergence',
      description: 'Two parallel codebases with different aesthetics (green vs silver) need consolidation',
      node: 'ui',
      suggestedFix: 'Merge refined silver UI into 30-file modular build, preserving advanced functionality'
    }
  ]
};

// ============ UTILITIES ============
const getStatusColor = (status) => {
  switch(status) {
    case 'stable': return THEME.accent.success;
    case 'needs-work': return THEME.accent.warning;
    case 'blocking': return THEME.accent.danger;
    case 'in-progress': return THEME.accent.cyan;
    default: return THEME.chrome.medium;
  }
};

const getPriorityColor = (priority) => {
  switch(priority) {
    case 'critical': return THEME.accent.danger;
    case 'high': return THEME.accent.warning;
    case 'medium': return THEME.accent.cyan;
    default: return THEME.chrome.dim;
  }
};

// ============ DRAGGABLE FLOATING PANEL ============
const FloatingPanel = ({ id, title, children, position, onClose, onDrag, zIndex, onFocus }) => {
  const panelRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (e.target.closest('.panel-content')) return;
    onFocus(id);
    setIsDragging(true);
    const rect = panelRef.current.getBoundingClientRect();
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleTouchStart = (e) => {
    if (e.target.closest('.panel-content')) return;
    onFocus(id);
    setIsDragging(true);
    const rect = panelRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    });
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      onDrag(id, {
        x: Math.max(0, Math.min(window.innerWidth - 200, clientX - dragOffset.x)),
        y: Math.max(0, Math.min(window.innerHeight - 100, clientY - dragOffset.y))
      });
    };

    const handleEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, dragOffset, id, onDrag]);

  return (
    <div
      ref={panelRef}
      className="fixed shadow-2xl"
      style={{
        left: position.x,
        top: position.y,
        zIndex: zIndex,
        background: THEME.bg.float,
        border: `1px solid ${THEME.chrome.dark}`,
        minWidth: '300px',
        maxWidth: '400px',
        maxHeight: '500px',
        touchAction: 'none'
      }}
      onMouseDown={() => onFocus(id)}
      onTouchStart={() => onFocus(id)}
    >
      <div
        className="px-3 py-2 flex items-center justify-between cursor-move select-none"
        style={{ borderBottom: `1px solid ${THEME.chrome.faint}` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <span style={{ color: THEME.chrome.medium }} className="font-mono text-xs">{title}</span>
        <button
          onClick={() => onClose(id)}
          style={{ color: THEME.chrome.dim }}
          className="font-mono text-xs hover:text-white px-1"
        >
          ✕
        </button>
      </div>
      <div className="panel-content overflow-y-auto" style={{ maxHeight: '450px', WebkitOverflowScrolling: 'touch' }}>
        {children}
      </div>
    </div>
  );
};

// ============ CLAUDE ICON ============
const ClaudeIcon = ({ size = 40 }) => (
  <svg viewBox="0 0 40 40" width={size} height={size}>
    <rect x="4" y="4" width="32" height="32" fill="none" stroke={THEME.chrome.dim} strokeWidth="1"/>
    <circle cx="20" cy="20" r="10" fill="none" stroke={THEME.chrome.medium} strokeWidth="1"/>
    <line x1="20" y1="6" x2="20" y2="14" stroke={THEME.chrome.medium} strokeWidth="1"/>
    <line x1="20" y1="26" x2="20" y2="34" stroke={THEME.chrome.medium} strokeWidth="1"/>
    <line x1="6" y1="20" x2="14" y2="20" stroke={THEME.chrome.medium} strokeWidth="1"/>
    <line x1="26" y1="20" x2="34" y2="20" stroke={THEME.chrome.medium} strokeWidth="1"/>
    <circle cx="20" cy="20" r="3" fill={THEME.chrome.bright}/>
  </svg>
);

// ============ CLAUDE PANEL WITH REAL API ============
const ClaudePanel = ({ expanded, onToggle, chatHistory, onSend, onPopOut, isLoading, selectedNode, project }) => {
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);
  const lastMsg = chatHistory[chatHistory.length - 1];

  useEffect(() => {
    if (expanded && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, expanded]);

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div style={{ borderBottom: `1px solid ${THEME.chrome.faint}` }} className="flex-shrink-0">
      {/* Header */}
      <div 
        className="px-4 py-2 flex items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <ClaudeIcon size={36} />
          <div>
            <div style={{ color: THEME.chrome.bright }} className="font-mono text-sm font-light">CLAUDE</div>
            <div style={{ color: isLoading ? THEME.accent.cyan : THEME.chrome.dim }} className="font-mono text-xs font-light">
              {isLoading ? 'PROCESSING...' : 'LINK ACTIVE'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {expanded && (
            <button
              onClick={(e) => { e.stopPropagation(); onPopOut(); }}
              style={{ color: THEME.chrome.dim }}
              className="font-mono text-xs px-2 hover:text-white"
            >
              ◳
            </button>
          )}
          <span style={{ color: THEME.chrome.dim }} className="font-mono text-xs">{expanded ? '[-]' : '[+]'}</span>
        </div>
      </div>

      {/* Message preview when collapsed */}
      {!expanded && lastMsg && (
        <div className="px-4 pb-2">
          <div style={{ color: THEME.text.secondary }} className="font-mono text-sm font-light truncate">
            {lastMsg.content.substring(0, 60)}...
          </div>
        </div>
      )}
      
      {/* Collapsed: prompt bar */}
      {!expanded && (
        <div className="px-4 pb-3">
          <button
            onClick={onToggle}
            style={{ border: `1px solid ${THEME.chrome.dark}`, color: THEME.chrome.medium }}
            className="w-full py-2 font-mono text-xs font-light hover:border-gray-500"
          >
            [ QUERY CLAUDE ]
          </button>
        </div>
      )}
      
      {/* Expanded chat */}
      <div className={`transition-all duration-200 overflow-hidden ${expanded ? 'max-h-80' : 'max-h-0'}`}>
        {/* Context indicator */}
        {selectedNode && (
          <div className="px-4 py-1" style={{ background: THEME.chrome.faint }}>
            <span style={{ color: THEME.chrome.dim }} className="font-mono text-xs font-light">
              CONTEXT: {project.nodes[selectedNode]?.name || 'NONE'}
            </span>
          </div>
        )}
        
        <div className="px-4 pb-2 max-h-48 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          {chatHistory.map((msg, i) => (
            <div key={i} className={`mb-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
              <div className="flex items-start gap-1" style={{ justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <span style={{ color: THEME.chrome.dim }} className="font-mono text-xs">[{msg.time}]</span>
              </div>
              <div 
                style={{ 
                  background: msg.role === 'user' ? THEME.chrome.faint : 'transparent',
                  color: msg.role === 'error' ? THEME.accent.danger : THEME.text.primary,
                  borderLeft: msg.role === 'assistant' ? `2px solid ${THEME.chrome.dim}` : 'none'
                }} 
                className="inline-block px-2 py-1 font-mono text-xs font-light max-w-[90%] text-left"
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="mb-2">
              <div style={{ color: THEME.accent.cyan }} className="font-mono text-xs font-light animate-pulse">
                ▸ Processing query...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        
        <div className="px-4 pb-3 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            placeholder={selectedNode ? `Query about ${project.nodes[selectedNode]?.name}...` : 'Query...'}
            disabled={isLoading}
            style={{ 
              background: 'transparent', 
              borderBottom: `1px solid ${THEME.chrome.dark}`, 
              color: THEME.text.primary,
              opacity: isLoading ? 0.5 : 1
            }}
            className="flex-1 px-1 py-1 font-mono text-xs font-light outline-none focus:border-gray-500"
          />
          <button 
            onClick={handleSubmit}
            disabled={isLoading}
            style={{ color: isLoading ? THEME.chrome.dim : THEME.chrome.medium }}
            className="font-mono text-xs font-light hover:text-white px-2"
          >
            {isLoading ? '...' : '▸'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ MAP PANEL ============
const MapPanel = ({ nodes, selectedNode, onNodeClick, expanded, onToggle }) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastTouchDist, setLastTouchDist] = useState(0);

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(e.touches[1].clientX - e.touches[0].clientX, e.touches[1].clientY - e.touches[0].clientY);
      setLastTouchDist(dist);
    }
  }, [pan]);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    if (e.touches.length === 1 && isDragging) {
      setPan({ x: e.touches[0].clientX - dragStart.x, y: e.touches[0].clientY - dragStart.y });
    } else if (e.touches.length === 2 && lastTouchDist > 0) {
      const dist = Math.hypot(e.touches[1].clientX - e.touches[0].clientX, e.touches[1].clientY - e.touches[0].clientY);
      setZoom(z => Math.min(3, Math.max(0.5, z * (dist / lastTouchDist))));
      setLastTouchDist(dist);
    }
  }, [isDragging, dragStart, lastTouchDist]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setLastTouchDist(0);
  }, []);

  const nodeList = Object.values(nodes);
  const selected = selectedNode ? nodes[selectedNode] : null;

  // Build connections
  const connections = [];
  nodeList.forEach(node => {
    node.dependencies.down.forEach(depId => {
      if (nodes[depId]) {
        connections.push({
          from: node.id, to: depId,
          x1: node.x, y1: node.y,
          x2: nodes[depId].x, y2: nodes[depId].y,
          status: nodes[depId].status
        });
      }
    });
  });

  return (
    <div style={{ borderBottom: `1px solid ${THEME.chrome.faint}` }} className="flex-shrink-0">
      <div className="px-4 py-2 flex justify-between items-center cursor-pointer" onClick={onToggle}>
        <span style={{ color: THEME.chrome.dim }} className="font-mono text-xs font-light">
          WORKFLOW // {selected?.name || 'OVERVIEW'}
        </span>
        <div className="flex items-center gap-2">
          {expanded && (
            <div className="flex gap-1" onClick={e => e.stopPropagation()}>
              <button onClick={() => setZoom(z => Math.min(3, z * 1.25))} style={{ color: THEME.chrome.dim }} className="w-6 h-6 font-mono text-xs border border-current hover:text-white">+</button>
              <button onClick={() => setZoom(z => Math.max(0.5, z / 1.25))} style={{ color: THEME.chrome.dim }} className="w-6 h-6 font-mono text-xs border border-current hover:text-white">-</button>
              <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} style={{ color: THEME.chrome.dim }} className="w-6 h-6 font-mono text-xs border border-current hover:text-white">⌂</button>
            </div>
          )}
          <span style={{ color: THEME.chrome.dim }} className="font-mono text-xs">{expanded ? '[-]' : '[+]'}</span>
        </div>
      </div>

      <div className={`transition-all duration-200 overflow-hidden ${expanded ? 'max-h-64' : 'max-h-0'}`}>
        <div className="px-3 pb-3">
          <div 
            className="relative overflow-hidden touch-none"
            style={{ height: '180px', border: `1px solid ${THEME.chrome.dark}` }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Subtle grid */}
            <div className="absolute inset-0 pointer-events-none opacity-10"
              style={{
                backgroundImage: `linear-gradient(${THEME.chrome.dim} 1px, transparent 1px), linear-gradient(90deg, ${THEME.chrome.dim} 1px, transparent 1px)`,
                backgroundSize: '30px 30px'
              }}
            />
            
            <svg 
              viewBox="0 0 340 140"
              className="w-full h-full"
              style={{ transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`, transformOrigin: 'center' }}
            >
              <defs>
                <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L6,3 z" fill={THEME.chrome.dim} />
                </marker>
                <marker id="arrow-danger" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L6,3 z" fill={THEME.accent.danger} />
                </marker>
              </defs>
              
              {/* Connections */}
              {connections.map((conn) => (
                <line 
                  key={`${conn.from}-${conn.to}`}
                  x1={conn.x1} y1={conn.y1}
                  x2={conn.x2} y2={conn.y2}
                  stroke={conn.status === 'blocking' ? THEME.accent.danger : THEME.chrome.dim}
                  strokeWidth={conn.status === 'blocking' ? '1' : '0.5'}
                  strokeDasharray={conn.status === 'blocking' ? '2,2' : '4,3'}
                  markerEnd={conn.status === 'blocking' ? 'url(#arrow-danger)' : 'url(#arrow)'}
                  opacity="0.6"
                />
              ))}
              
              {/* Nodes */}
              {nodeList.map(node => {
                const isSelected = selectedNode === node.id;
                const statusColor = getStatusColor(node.status);
                
                return (
                  <g 
                    key={node.id} 
                    onClick={(e) => { e.stopPropagation(); onNodeClick(node.id); }}
                    className="cursor-pointer"
                  >
                    <rect 
                      x={node.x - 32} y={node.y - 12}
                      width="64" height="24"
                      fill={isSelected ? THEME.chrome.faint : 'transparent'}
                      stroke={isSelected ? THEME.chrome.medium : THEME.chrome.dim}
                      strokeWidth={isSelected ? 1.5 : 0.5}
                    />
                    
                    {/* Status indicator */}
                    <circle cx={node.x - 22} cy={node.y} r="4" fill={statusColor}>
                      {node.status === 'blocking' && (
                        <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite"/>
                      )}
                    </circle>
                    
                    {/* Priority indicator for critical */}
                    {node.priority === 'critical' && (
                      <text x={node.x + 24} y={node.y - 4} fill={THEME.accent.danger} fontSize="8" fontFamily="monospace">!</text>
                    )}
                    
                    {/* Label */}
                    <text 
                      x={node.x + 2} y={node.y + 3}
                      textAnchor="middle"
                      fill={isSelected ? THEME.chrome.bright : THEME.chrome.medium}
                      fontSize="7"
                      fontFamily="monospace"
                      fontWeight="300"
                    >
                      {node.name}
                    </text>
                  </g>
                );
              })}
            </svg>
            
            <div className="absolute bottom-1 left-2 font-mono text-xs font-light" style={{ color: THEME.chrome.dim }}>
              {Math.round(zoom * 100)}%
            </div>
          </div>
          
          {/* Selected node info */}
          {selected && (
            <div style={{ borderTop: `1px solid ${THEME.chrome.faint}` }} className="mt-2 pt-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: getStatusColor(selected.status) }}/>
                <span style={{ color: THEME.chrome.medium }} className="font-mono text-xs font-light">{selected.name}</span>
                <span style={{ color: getPriorityColor(selected.priority) }} className="font-mono text-xs font-light">
                  [{selected.priority.toUpperCase()}]
                </span>
              </div>
              <div style={{ color: THEME.chrome.dim }} className="font-mono text-xs font-light mt-1">
                {selected.technical}
              </div>
            </div>
          )}
          
          {/* Legend */}
          <div className="flex justify-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: THEME.accent.success }}/>
              <span style={{ color: THEME.chrome.dim }} className="font-mono text-xs font-light">STABLE</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: THEME.accent.warning }}/>
              <span style={{ color: THEME.chrome.dim }} className="font-mono text-xs font-light">WORK</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: THEME.accent.danger }}/>
              <span style={{ color: THEME.chrome.dim }} className="font-mono text-xs font-light">BLOCK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ DETAIL PANEL ============
const DetailPanel = ({ node, sessionWraps, onPopOut, onSessionWrapClick, criticalIssues }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!node) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div style={{ color: THEME.chrome.dim }} className="font-mono text-xs font-light text-center mb-4">
          Select a node to view details
        </div>
        
        {/* Show critical issues when no node selected */}
        {criticalIssues && criticalIssues.length > 0 && (
          <div className="w-full max-w-sm">
            <div style={{ color: THEME.accent.danger }} className="font-mono text-xs font-light mb-2">
              ⚠ CRITICAL ISSUES
            </div>
            {criticalIssues.map(issue => (
              <div 
                key={issue.id} 
                className="mb-2 p-2"
                style={{ border: `1px solid ${THEME.accent.danger}`, background: 'rgba(154, 90, 90, 0.1)' }}
              >
                <div style={{ color: THEME.text.primary }} className="font-mono text-xs font-light">{issue.title}</div>
                <div style={{ color: THEME.text.secondary }} className="font-mono text-xs font-light mt-1">{issue.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const statusColor = getStatusColor(node.status);
  const tabs = ['OVERVIEW', 'FILES', 'DEPS', 'NOTES'];
  
  // Find issues related to this node
  const nodeIssues = criticalIssues?.filter(i => i.node === node.id) || [];

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-2 flex items-center justify-between" style={{ borderBottom: `1px solid ${THEME.chrome.faint}` }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: statusColor }}/>
          <span style={{ color: THEME.chrome.bright }} className="font-mono text-sm font-light">{node.name}</span>
          <span style={{ color: statusColor }} className="font-mono text-xs font-light">
            {node.status.toUpperCase().replace('-', ' ')}
          </span>
        </div>
        <button
          onClick={() => onPopOut('detail', node)}
          style={{ color: THEME.chrome.dim }}
          className="font-mono text-xs hover:text-white"
        >
          ◳
        </button>
      </div>

      {/* Tabs */}
      <div className="flex px-4" style={{ borderBottom: `1px solid ${THEME.chrome.faint}` }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            style={{ 
              color: activeTab === tab.toLowerCase() ? THEME.chrome.bright : THEME.chrome.dim,
              borderBottom: activeTab === tab.toLowerCase() ? `1px solid ${THEME.chrome.medium}` : '1px solid transparent'
            }}
            className="py-2 px-3 font-mono text-xs font-light"
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4" style={{ WebkitOverflowScrolling: 'touch' }}>
        {activeTab === 'overview' && (
          <div className="space-y-3">
            {/* Critical issue alert */}
            {nodeIssues.length > 0 && (
              <div 
                className="p-2 mb-3"
                style={{ border: `1px solid ${THEME.accent.danger}`, background: 'rgba(154, 90, 90, 0.1)' }}
              >
                <div style={{ color: THEME.accent.danger }} className="font-mono text-xs font-light mb-1">⚠ ISSUE</div>
                {nodeIssues.map(issue => (
                  <div key={issue.id}>
                    <div style={{ color: THEME.text.primary }} className="font-mono text-xs font-light">{issue.title}</div>
                    <div style={{ color: THEME.text.secondary }} className="font-mono text-xs font-light mt-1">{issue.suggestedFix}</div>
                  </div>
                ))}
              </div>
            )}
            
            <div>
              <div style={{ color: THEME.chrome.dim }} className="font-mono text-xs font-light mb-1">FUNCTION</div>
              <div style={{ color: THEME.text.secondary }} className="text-sm font-light leading-relaxed">{node.function}</div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span style={{ color: THEME.chrome.dim }} className="font-mono text-xs font-light">COVERAGE</span>
                  <span style={{ color: node.testCoverage > 70 ? THEME.accent.success : THEME.accent.warning }} className="font-mono text-xs font-light">{node.testCoverage}%</span>
                </div>
                <div style={{ background: THEME.chrome.faint }} className="h-1">
                  <div className="h-full" style={{ width: `${node.testCoverage}%`, background: node.testCoverage > 70 ? THEME.accent.success : THEME.accent.warning }}/>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span style={{ color: THEME.chrome.dim }} className="font-mono text-xs font-light">LINT</span>
                  <span style={{ color: node.lintErrors === 0 ? THEME.accent.success : THEME.accent.danger }} className="font-mono text-xs font-light">{node.lintErrors} ERR</span>
                </div>
                <div style={{ background: THEME.chrome.faint }} className="h-1">
                  <div className="h-full" style={{ width: `${Math.max(10, 100 - node.lintErrors * 10)}%`, background: node.lintErrors === 0 ? THEME.accent.success : THEME.accent.danger }}/>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <span style={{ color: THEME.chrome.dim }} className="font-mono text-xs font-light">MODIFIED</span>
              <span style={{ color: THEME.text.secondary }} className="font-mono text-xs font-light">{node.lastModified}</span>
            </div>
            
            <div className="flex justify-between">
              <span style={{ color: THEME.chrome.dim }} className="font-mono text-xs font-light">PRIORITY</span>
              <span style={{ color: getPriorityColor(node.priority) }} className="font-mono text-xs font-light">{node.priority.toUpperCase()}</span>
            </div>
          </div>
        )}
        
        {activeTab === 'files' && (
          <div className="space-y-3">
            <div>
              <div style={{ color: THEME.chrome.dim }} className="font-mono text-xs font-light mb-2">SOURCE FILES ({node.files.length})</div>
              {node.files.map((file, i) => (
                <div key={i} className="flex items-center gap-2 mb-1 hover:bg-gray-900 px-1 py-0.5 cursor-pointer">
                  <span style={{ color: file.retrievable ? THEME.accent.cyan : THEME.chrome.dim }} className="font-mono text-xs">
                    {file.retrievable ? '▸' : '○'}
                  </span>
                  <span style={{ color: file.retrievable ? THEME.text.secondary : THEME.chrome.dim }} className="font-mono text-xs font-light">
                    {file.path}
                  </span>
                </div>
              ))}
            </div>
            {node.docs.length > 0 && (
              <div>
                <div style={{ color: THEME.chrome.dim }} className="font-mono text-xs font-light mb-2">DOCUMENTATION</div>
                {node.docs.map((doc, i) => (
                  <div key={i} className="flex items-center gap-2 mb-1 hover:bg-gray-900 px-1 py-0.5 cursor-pointer">
                    <span style={{ color: THEME.accent.success }} className="font-mono text-xs">◈</span>
                    <span style={{ color: THEME.text.secondary }} className="font-mono text-xs font-light">{doc.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'deps' && (
          <div className="space-y-3">
            <div>
              <div style={{ color: THEME.chrome.dim }} className="font-mono text-xs font-light mb-2">↑ DEPENDS ON</div>
              {node.dependencies.up.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {node.dependencies.up.map(d => (
                    <span key={d} style={{ border: `1px solid ${THEME.chrome.faint}`, color: THEME.text.secondary }} className="px-2 py-1 font-mono text-xs font-light">{d.toUpperCase()}</span>
                  ))}
                </div>
              ) : (
                <span style={{ color: THEME.chrome.dim }} className="font-mono text-xs font-light italic">None (root node)</span>
              )}
            </div>
            <div>
              <div style={{ color: THEME.chrome.dim }} className="font-mono text-xs font-light mb-2">↓ REQUIRED BY</div>
              {node.dependencies.down.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {node.dependencies.down.map(d => (
                    <span key={d} style={{ border: `1px solid ${THEME.chrome.faint}`, color: THEME.text.secondary }} className="px-2 py-1 font-mono text-xs font-light">{d.toUpperCase()}</span>
                  ))}
                </div>
              ) : (
                <span style={{ color: THEME.chrome.dim }} className="font-mono text-xs font-light italic">None (leaf node)</span>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'notes' && (
          <div className="space-y-3">
            <div>
              <div style={{ color: THEME.chrome.dim }} className="font-mono text-xs font-light mb-1">IMPLEMENTATION NOTES</div>
              <div style={{ color: THEME.text.secondary }} className="text-sm font-light leading-relaxed">{node.notes}</div>
            </div>
            <div>
              <div style={{ color: THEME.chrome.dim }} className="font-mono text-xs font-light mb-2">SESSION WRAPS</div>
              {sessionWraps.map(sw => (
                <div 
                  key={sw.id} 
                  className="flex justify-between items-center mb-2 p-2 hover:bg-gray-900 cursor-pointer"
                  style={{ border: `1px solid ${THEME.chrome.faint}` }}
                  onClick={() => onSessionWrapClick(sw)}
                >
                  <div>
                    <div style={{ color: THEME.text.secondary }} className="font-mono text-xs font-light">{sw.title}</div>
                    <div style={{ color: THEME.chrome.dim }} className="font-mono text-xs font-light">{sw.date}</div>
                  </div>
                  <span style={{ color: THEME.accent.cyan }} className="font-mono text-xs">▸</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============ STATUS BAR ============
const StatusBar = ({ project }) => {
  const nodes = Object.values(project.nodes);
  const avgCoverage = Math.round(nodes.reduce((sum, n) => sum + n.testCoverage, 0) / nodes.length);
  const totalLintErrors = nodes.reduce((sum, n) => sum + n.lintErrors, 0);
  const blockingCount = nodes.filter(n => n.status === 'blocking').length;

  const Bar = ({ label, value, max, status, color }) => (
    <div className="flex-1">
      <div className="flex justify-between mb-1">
        <span style={{ color: THEME.chrome.dim }} className="font-mono text-xs font-light">{label}</span>
        <span style={{ color }} className="font-mono text-xs font-light">{status}</span>
      </div>
      <div style={{ background: THEME.chrome.faint }} className="h-1">
        <div className="h-full transition-all" style={{ width: `${Math.min(100, (value/max)*100)}%`, background: color }}/>
      </div>
    </div>
  );

  return (
    <div className="px-4 py-3 flex gap-4" style={{ borderTop: `1px solid ${THEME.chrome.faint}` }}>
      <Bar label="COVER" value={avgCoverage} max={100} status={avgCoverage > 60 ? 'GOOD' : 'LOW'}
        color={avgCoverage > 60 ? THEME.accent.success : THEME.accent.warning}/>
      <Bar label="LINT" value={totalLintErrors} max={20} status={totalLintErrors === 0 ? 'CLEAN' : `${totalLintErrors}`}
        color={totalLintErrors === 0 ? THEME.accent.success : THEME.accent.danger}/>
      <Bar label="STATUS" value={blockingCount === 0 ? 0 : 100} max={100} status={blockingCount === 0 ? 'GO' : 'BLOCKED'}
        color={blockingCount === 0 ? THEME.accent.success : THEME.accent.danger}/>
    </div>
  );
};

// ============ SESSION WRAP VIEWER ============
const SessionWrapViewer = ({ wrap, onClose }) => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-3">
        <div>
          <div style={{ color: THEME.chrome.bright }} className="font-mono text-sm font-light">{wrap.title}</div>
          <div style={{ color: THEME.chrome.dim }} className="font-mono text-xs font-light">{wrap.date} • {wrap.file}</div>
        </div>
      </div>
      <div style={{ color: THEME.text.secondary }} className="text-sm font-light leading-relaxed">
        {wrap.summary}
      </div>
      <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${THEME.chrome.faint}` }}>
        <div style={{ color: THEME.chrome.dim }} className="font-mono text-xs font-light">
          Full document available in project files: {wrap.file}
        </div>
      </div>
    </div>
  );
};

// ============ MAIN APP ============
export default function DevOpsMissionControl() {
  const [project] = useState(PROJECT_DATA);
  const [selectedNode, setSelectedNode] = useState(null);
  const [claudeExpanded, setClaudeExpanded] = useState(false);
  const [mapExpanded, setMapExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { 
      role: 'assistant', 
      content: `Link established for ${PROJECT_DATA.name}. Critical issue detected: instant mission failure bug in DEPLOYED node. Select a node for analysis or ask me about the architecture.`, 
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Floating panels state
  const [floatingPanels, setFloatingPanels] = useState([]);
  const [topZIndex, setTopZIndex] = useState(100);

  // Build system prompt for Claude
  const buildSystemPrompt = useCallback(() => {
    const node = selectedNode ? project.nodes[selectedNode] : null;
    const criticalIssues = project.criticalIssues?.map(i => `- ${i.title}: ${i.description}`).join('\n') || 'None';
    
    let prompt = `You are an AI assistant integrated into DevOps Mission Control for the "${project.name}" project.

PROJECT OVERVIEW:
- Repository: ${project.repo}
- Deployed URL: ${project.deployedUrl}
- Architecture: Seven-pillar modular system (Core, Pillars, Entities, UI, Entry, Deployed, Missions)

CRITICAL ISSUES:
${criticalIssues}

SESSION HISTORY:
${project.sessionWraps.map(sw => `- ${sw.date}: ${sw.title} - ${sw.summary}`).join('\n')}
`;

    if (node) {
      prompt += `
CURRENTLY SELECTED: ${node.name}
- Technical: ${node.technical}
- Status: ${node.status} | Priority: ${node.priority}
- Function: ${node.function}
- Notes: ${node.notes}
- Files: ${node.files.map(f => f.path).join(', ')}
- Dependencies up: ${node.dependencies.up.join(', ') || 'none (root)'}
- Dependencies down: ${node.dependencies.down.join(', ') || 'none (leaf)'}
- Test coverage: ${node.testCoverage}%
- Lint errors: ${node.lintErrors}

The user is viewing this component. Provide contextual, technical assistance.`;
    } else {
      prompt += `
No component selected. Provide general project guidance or help the user navigate to relevant components.`;
    }

    prompt += `

RESPONSE GUIDELINES:
- Be concise and technical
- Reference specific files and components when relevant
- For the critical bug (instant mission failure), suggest checking NPC detection logic in entities/npc.js and the game loop in main.js
- When discussing fixes, be specific about file locations and code changes needed`;

    return prompt;
  }, [selectedNode, project]);

  // Handle sending message to Claude API
  const handleSendMessage = async (message) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    setChatHistory(prev => [...prev, { role: 'user', content: message, time }]);
    setIsLoading(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: buildSystemPrompt(),
          messages: [
            // Include recent chat history for context
            ...chatHistory.slice(-6).map(msg => ({
              role: msg.role === 'assistant' ? 'assistant' : 'user',
              content: msg.content
            })),
            { role: 'user', content: message }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const rtime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: data.content[0].text, 
        time: rtime 
      }]);
    } catch (error) {
      const rtime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      
      // Fallback response when API isn't available
      const node = selectedNode ? project.nodes[selectedNode] : null;
      let fallbackResponse = '';
      
      if (message.toLowerCase().includes('bug') || message.toLowerCase().includes('fix') || message.toLowerCase().includes('failure')) {
        fallbackResponse = `The instant mission failure bug is in the deployed build. Root cause: NPC detection fires on tick 0 before player can act.

Fix options:
1. Add grace period in npc.detectPlayer() - skip detection for first 3-5 seconds
2. Delay NPC spawning until after intro sequence completes
3. Set initial detection radius to 0 and ramp up over first few ticks

Check: entities/npc.js detectPlayer() method and main.js game loop initialization.`;
      } else if (node) {
        fallbackResponse = `${node.name}: ${node.notes}

Status: ${node.status} | Coverage: ${node.testCoverage}%
Files: ${node.files.map(f => f.path).join(', ')}`;
      } else {
        fallbackResponse = `Project ${project.name} has 7 nodes. Critical issue: instant mission failure in deployed build due to aggressive NPC detection. Select the DEPLOYED node for details.`;
      }
      
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: fallbackResponse,
        time: rtime 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle pop-out panels
  const handlePopOut = (type, data) => {
    const id = `${type}-${Date.now()}`;
    const newPanel = {
      id,
      type,
      data,
      position: { x: 20 + floatingPanels.length * 20, y: 100 + floatingPanels.length * 20 },
      zIndex: topZIndex + 1
    };
    setFloatingPanels(prev => [...prev, newPanel]);
    setTopZIndex(prev => prev + 1);
  };

  const handleClosePanel = (id) => {
    setFloatingPanels(prev => prev.filter(p => p.id !== id));
  };

  const handleDragPanel = (id, position) => {
    setFloatingPanels(prev => prev.map(p => p.id === id ? { ...p, position } : p));
  };

  const handleFocusPanel = (id) => {
    setFloatingPanels(prev => prev.map(p => p.id === id ? { ...p, zIndex: topZIndex + 1 } : p));
    setTopZIndex(prev => prev + 1);
  };

  // Handle session wrap click
  const handleSessionWrapClick = (wrap) => {
    handlePopOut('sessionWrap', wrap);
  };

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, []);

  const node = selectedNode ? project.nodes[selectedNode] : null;

  return (
    <div
      className="w-full max-w-md mx-auto flex flex-col relative overflow-hidden select-none"
      style={{
        background: THEME.bg.primary,
        fontFamily: "'Courier New', monospace",
        height: '100vh',
        height: '100dvh',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none z-40 opacity-5"
        style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)' }}
      />

      {/* Header */}
      <div className="px-4 py-2 flex justify-between items-center" style={{ borderBottom: `1px solid ${THEME.chrome.faint}` }}>
        <div>
          <span style={{ color: THEME.chrome.bright }} className="font-mono text-sm font-light">{project.name}</span>
          <span style={{ color: THEME.chrome.dim }} className="font-mono text-xs font-light ml-2">MISSION CONTROL</span>
        </div>
        <div className="flex items-center gap-2">
          {project.criticalIssues?.length > 0 && (
            <span style={{ color: THEME.accent.danger }} className="font-mono text-xs animate-pulse">⚠ {project.criticalIssues.length}</span>
          )}
          <span style={{ color: THEME.chrome.dim }} className="font-mono text-xs font-light">[SILVER]</span>
        </div>
      </div>
      
      {/* Claude Panel */}
      <ClaudePanel 
        expanded={claudeExpanded}
        onToggle={() => setClaudeExpanded(!claudeExpanded)}
        chatHistory={chatHistory}
        onSend={handleSendMessage}
        onPopOut={() => handlePopOut('chat', chatHistory)}
        isLoading={isLoading}
        selectedNode={selectedNode}
        project={project}
      />
      
      {/* Map Panel */}
      <MapPanel
        nodes={project.nodes}
        selectedNode={selectedNode}
        onNodeClick={setSelectedNode}
        expanded={mapExpanded}
        onToggle={() => setMapExpanded(!mapExpanded)}
      />
      
      {/* Detail Panel */}
      <div style={{ background: THEME.bg.panel }} className="flex-1 overflow-hidden min-h-0">
        <DetailPanel 
          node={node}
          sessionWraps={project.sessionWraps}
          onPopOut={handlePopOut}
          onSessionWrapClick={handleSessionWrapClick}
          criticalIssues={project.criticalIssues}
        />
      </div>
      
      {/* Status Bar */}
      <StatusBar project={project} />
      
      {/* Floating Panels */}
      {floatingPanels.map(panel => (
        <FloatingPanel
          key={panel.id}
          id={panel.id}
          title={
            panel.type === 'detail' ? `${panel.data.name} - DETAILS` : 
            panel.type === 'sessionWrap' ? `SESSION: ${panel.data.title}` :
            'CHAT HISTORY'
          }
          position={panel.position}
          zIndex={panel.zIndex}
          onClose={handleClosePanel}
          onDrag={handleDragPanel}
          onFocus={handleFocusPanel}
        >
          {panel.type === 'detail' && (
            <div className="p-3">
              <div style={{ color: THEME.chrome.dim }} className="font-mono text-xs font-light mb-2">NOTES</div>
              <div style={{ color: THEME.text.secondary }} className="text-sm font-light leading-relaxed">{panel.data.notes}</div>
              <div style={{ color: THEME.chrome.dim }} className="font-mono text-xs font-light mt-3 mb-2">FILES</div>
              {panel.data.files.map((f, i) => (
                <div key={i} style={{ color: THEME.text.dim }} className="font-mono text-xs font-light">▸ {f.path}</div>
              ))}
            </div>
          )}
          {panel.type === 'sessionWrap' && (
            <SessionWrapViewer wrap={panel.data} onClose={() => handleClosePanel(panel.id)} />
          )}
          {panel.type === 'chat' && (
            <div className="p-3 max-h-80 overflow-y-auto">
              {panel.data.map((msg, i) => (
                <div key={i} className="mb-2">
                  <span style={{ color: THEME.chrome.dim }} className="font-mono text-xs font-light">[{msg.time}] </span>
                  <span style={{ color: msg.role === 'user' ? THEME.accent.cyan : THEME.text.secondary }} className="font-mono text-xs font-light">
                    {msg.role === 'user' ? 'YOU: ' : 'CLAUDE: '}
                  </span>
                  <span style={{ color: THEME.text.secondary }} className="font-mono text-xs font-light">{msg.content}</span>
                </div>
              ))}
            </div>
          )}
        </FloatingPanel>
      ))}
    </div>
  );
}
