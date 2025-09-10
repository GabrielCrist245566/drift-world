import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { RotateCcw, Play, Pause, Trophy, Map, ArrowLeft, Car, Palette } from 'lucide-react';
import { trackTemplates, carTypes, carColors } from './mock';

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const keysRef = useRef({});
  const particlesRef = useRef([]);
  
  const [gameState, setGameState] = useState('menu'); // menu, mapSelect, carCustomize, playing, paused, gameOver
  const [score, setScore] = useState(0);
  const [driftStreak, setDriftStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [time, setTime] = useState(0);
  const [selectedTrack, setSelectedTrack] = useState(0);
  const [selectedCar, setSelectedCar] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);

  // Car properties
  const car = useRef({
    x: 400,
    y: 300,
    angle: 0,
    velocity: { x: 0, y: 0 },
    speed: 0,
    maxSpeed: 8,
    acceleration: 0.3,
    friction: 0.95,
    turnSpeed: 0.05,
    isDrifting: false,
    driftAngle: 0,
    wheelAngle: 0
  });

  // Particle system for drift effects
  const createParticle = (x, y, angle) => {
    return {
      x: x,
      y: y,
      vx: Math.cos(angle + Math.PI) * (2 + Math.random() * 3),
      vy: Math.sin(angle + Math.PI) * (2 + Math.random() * 3),
      life: 1.0,
      decay: 0.02 + Math.random() * 0.02,
      size: 2 + Math.random() * 3
    };
  };

  // Input handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysRef.current[e.key] = true;
    };

    const handleKeyUp = (e) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Physics update
  const updatePhysics = useCallback(() => {
    const currentCar = car.current;
    const keys = keysRef.current;
    const carType = carTypes[selectedCar];

    // Apply car-specific stats
    const maxSpeed = carType.maxSpeed;
    const acceleration = carType.acceleration;
    const handling = carType.handling;

    // Handle input
    if (keys['ArrowUp'] || keys['w']) {
      currentCar.speed = Math.min(currentCar.speed + acceleration, maxSpeed);
    }
    if (keys['ArrowDown'] || keys['s']) {
      currentCar.speed = Math.max(currentCar.speed - acceleration, -maxSpeed * 0.5);
    }
    if (keys['ArrowLeft'] || keys['a']) {
      currentCar.angle -= handling * (currentCar.speed / 2);
      currentCar.wheelAngle = Math.max(currentCar.wheelAngle - 0.1, -0.5);
    } else if (keys['ArrowRight'] || keys['d']) {
      currentCar.angle += handling * (currentCar.speed / 2);
      currentCar.wheelAngle = Math.min(currentCar.wheelAngle + 0.1, 0.5);
    } else {
      currentCar.wheelAngle *= 0.9; // Return to center
    }

    // Apply friction
    currentCar.speed *= carType.friction;

    // Calculate drift
    const forwardX = Math.cos(currentCar.angle);
    const forwardY = Math.sin(currentCar.angle);
    
    const velocityMagnitude = Math.sqrt(currentCar.velocity.x ** 2 + currentCar.velocity.y ** 2);
    
    if (velocityMagnitude > 0.1) {
      const velocityAngle = Math.atan2(currentCar.velocity.y, currentCar.velocity.x);
      const angleDiff = Math.abs(currentCar.angle - velocityAngle);
      const normalizedAngleDiff = Math.min(angleDiff, Math.PI * 2 - angleDiff);
      
      currentCar.isDrifting = normalizedAngleDiff > 0.3 && currentCar.speed > 3;
      currentCar.driftAngle = normalizedAngleDiff;

      // Create drift particles
      if (currentCar.isDrifting && Math.random() < 0.3) {
        const backX = currentCar.x - Math.cos(currentCar.angle) * 15;
        const backY = currentCar.y - Math.sin(currentCar.angle) * 15;
        particlesRef.current.push(createParticle(backX, backY, currentCar.angle));
      }
    } else {
      currentCar.isDrifting = false;
    }

    // Update velocity
    currentCar.velocity.x += forwardX * currentCar.speed * 0.1;
    currentCar.velocity.y += forwardY * currentCar.speed * 0.1;
    
    // Apply air resistance
    currentCar.velocity.x *= 0.98;
    currentCar.velocity.y *= 0.98;

    // Update position
    currentCar.x += currentCar.velocity.x;
    currentCar.y += currentCar.velocity.y;

    // Get current track
    const track = trackTemplates[selectedTrack];
    
    // Boundary collision
    if (currentCar.x < track.boundaries[1].x + track.boundaries[1].width + 15) currentCar.x = track.boundaries[1].x + track.boundaries[1].width + 15;
    if (currentCar.x > track.boundaries[3].x - 15) currentCar.x = track.boundaries[3].x - 15;
    if (currentCar.y < track.boundaries[0].y + track.boundaries[0].height + 15) currentCar.y = track.boundaries[0].y + track.boundaries[0].height + 15;
    if (currentCar.y > track.boundaries[2].y - 15) currentCar.y = track.boundaries[2].y - 15;

    // Update particles
    particlesRef.current = particlesRef.current.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.98;
      particle.vy *= 0.98;
      particle.life -= particle.decay;
      return particle.life > 0;
    });

    // Drift scoring
    if (currentCar.isDrifting && currentCar.speed > 2) {
      const driftPoints = Math.floor(currentCar.driftAngle * currentCar.speed * carType.driftMultiplier);
      setScore(prev => prev + driftPoints);
      setDriftStreak(prev => prev + 1);
    } else {
      setDriftStreak(0);
    }
  }, [selectedTrack, selectedCar]);

  // Enhanced render function with JDM car designs
  const renderCar = (ctx, currentCar) => {
    const carType = carTypes[selectedCar];
    const carColor = carColors[selectedColor];

    ctx.save();
    ctx.translate(currentCar.x, currentCar.y);
    ctx.rotate(currentCar.angle);
    
    // Car shadow
    ctx.save();
    ctx.translate(3, 3);
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#000';
    
    // Different shadow sizes for different cars
    if (carType.shape === 'rx7' || carType.shape === 'supra') {
      ctx.fillRect(-22, -11, 44, 22);
    } else if (carType.shape === 'r34') {
      ctx.fillRect(-24, -12, 48, 24);
    } else if (carType.shape === 'evo' || carType.shape === 'sti') {
      ctx.fillRect(-20, -12, 40, 24);
    } else {
      ctx.fillRect(-20, -10, 40, 20);
    }
    ctx.restore();
    
    // Car body with gradient based on selected color
    const carGradient = ctx.createLinearGradient(-22, -12, -22, 12);
    if (currentCar.isDrifting) {
      carGradient.addColorStop(0, carColor.primary);
      carGradient.addColorStop(1, carColor.secondary);
    } else {
      carGradient.addColorStop(0, carColor.secondary);
      carGradient.addColorStop(1, carColor.primary);
    }
    ctx.fillStyle = carGradient;
    
    // Draw car based on JDM type
    if (carType.shape === 'rx7') {
      // Mazda RX-7 FD - sleek sports car
      ctx.fillRect(-22, -10, 44, 20);
      // Pop-up headlights area
      ctx.fillStyle = carColor.accent;
      ctx.fillRect(18, -8, 4, 16);
      // Side skirts
      ctx.fillRect(-18, -12, 36, 2);
      ctx.fillRect(-18, 10, 36, 2);
    } else if (carType.shape === 'r34') {
      // Nissan Skyline R34 GT-R - wide and aggressive
      ctx.fillRect(-24, -12, 48, 24);
      // Hood vents
      ctx.fillStyle = carColor.accent;
      ctx.fillRect(-16, -8, 20, 2);
      ctx.fillRect(-16, -4, 20, 2);
      // Rear spoiler
      ctx.fillRect(-22, -8, 2, 16);
    } else if (carType.shape === 'supra') {
      // Toyota Supra MK4 - muscular and wide
      ctx.fillRect(-22, -11, 44, 22);
      // Large rear spoiler
      ctx.fillStyle = carColor.accent;
      ctx.fillRect(-24, -6, 4, 12);
      // Side air intakes
      ctx.fillRect(16, -4, 6, 8);
    } else if (carType.shape === 'evo') {
      // Mitsubishi Lancer Evo IX - rally-bred
      ctx.fillRect(-20, -11, 40, 22);
      // Large rear wing
      ctx.fillStyle = carColor.accent;
      ctx.fillRect(-22, -4, 2, 8);
      ctx.fillRect(-24, -3, 4, 6);
      // Front splitter
      ctx.fillRect(18, -8, 4, 16);
    } else if (carType.shape === 'sti') {
      // Subaru Impreza WRX STI
      ctx.fillRect(-20, -11, 40, 22);
      // Hood scoop
      ctx.fillStyle = carColor.accent;
      ctx.fillRect(-8, -10, 8, 4);
      // Rear spoiler
      ctx.fillRect(-22, -3, 2, 6);
    } else if (carType.shape === 'nsx') {
      // Honda NSX - mid-engine supercar
      ctx.fillRect(-21, -9, 42, 18);
      // Mid-engine air intakes
      ctx.fillStyle = carColor.accent;
      ctx.fillRect(-8, -11, 6, 2);
      ctx.fillRect(-8, 9, 6, 2);
    } else if (carType.shape === 'eclipse') {
      // Mitsubishi Eclipse GSX
      ctx.fillRect(-20, -10, 40, 20);
      // Rear spoiler
      ctx.fillStyle = carColor.accent;
      ctx.fillRect(-22, -4, 2, 8);
    } else if (carType.shape === 's13') {
      // Nissan 240SX S13 - drift missile
      ctx.fillRect(-19, -9, 38, 18);
      // Minimal aero
      ctx.fillStyle = carColor.accent;
      ctx.fillRect(17, -6, 2, 12);
    } else if (carType.shape === 'ae86') {
      // Toyota AE86 Corolla - lightweight classic
      ctx.fillRect(-18, -9, 36, 18);
      // Simple rear spoiler
      ctx.fillStyle = carColor.accent;
      ctx.fillRect(-20, -3, 2, 6);
    } else if (carType.shape === 'civic') {
      // Honda Civic Type R
      ctx.fillRect(-19, -10, 38, 20);
      // Large rear wing
      ctx.fillStyle = carColor.accent;
      ctx.fillRect(-22, -4, 3, 8);
      // Front splitter
      ctx.fillRect(17, -8, 2, 16);
    } else if (carType.shape === 'miata') {
      // Mazda MX-5 Miata - small roadster
      ctx.fillRect(-17, -8, 34, 16);
      // Roll bar
      ctx.strokeStyle = carColor.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -6, 8, Math.PI, 0);
      ctx.stroke();
    } else if (carType.shape === '350z') {
      // Nissan 350Z
      ctx.fillRect(-21, -10, 42, 20);
      // Z-car signature profile
      ctx.fillStyle = carColor.accent;
      ctx.fillRect(16, -8, 5, 16);
    } else {
      // Default car shape
      ctx.fillRect(-20, -10, 40, 20);
    }
    
    // Car interior/windows
    ctx.fillStyle = '#2a2a2a';
    if (carType.shape === 'r34') {
      ctx.fillRect(-20, -10, 40, 20);
    } else if (carType.shape === 'supra') {
      ctx.fillRect(-18, -9, 36, 18);
    } else {
      ctx.fillRect(-16, -8, 32, 16);
    }
    
    // Windshield
    ctx.fillStyle = carColor.glass;
    ctx.globalAlpha = 0.8;
    if (carType.shape === 'nsx') {
      ctx.fillRect(-10, -6, 20, 12);  // Mid-engine smaller windshield
    } else if (carType.shape === 'miata') {
      ctx.fillRect(-8, -5, 16, 10);   // Roadster windshield
    } else {
      ctx.fillRect(-12, -6, 24, 12);
    }
    ctx.globalAlpha = 1;
    
    // Headlights - different styles for different cars
    ctx.fillStyle = carColor.lights;
    if (carType.shape === 'rx7') {
      // Pop-up headlights
      ctx.fillRect(20, -4, 2, 2);
      ctx.fillRect(20, 2, 2, 2);
    } else if (carType.shape === 'r34') {
      // Round headlights
      ctx.beginPath();
      ctx.arc(22, -6, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(22, 6, 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (carType.shape === 'ae86') {
      // Rectangle headlights
      ctx.fillRect(16, -5, 2, 3);
      ctx.fillRect(16, 2, 2, 3);
    } else {
      // Standard headlights
      ctx.fillRect(18, -3, 4, 2);
      ctx.fillRect(18, 1, 4, 2);
    }
    
    // Wheels with enhanced graphics
    ctx.fillStyle = '#1a1a1a';
    const wheelSize = carType.shape === 'r34' ? 8 : 7;
    
    // Front wheels (can turn)
    ctx.save();
    ctx.translate(12, -10);
    ctx.rotate(currentCar.wheelAngle);
    ctx.fillRect(-2, -wheelSize/2, 4, wheelSize);
    // Rim design
    ctx.fillStyle = carColor.rims;
    ctx.fillRect(-1, -wheelSize/2 + 1, 2, wheelSize - 2);
    // Brake discs
    ctx.strokeStyle = carColor.rims;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, wheelSize/2 - 1, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    
    ctx.save();
    ctx.translate(12, 10);
    ctx.rotate(currentCar.wheelAngle);
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-2, -wheelSize/2, 4, wheelSize);
    ctx.fillStyle = carColor.rims;
    ctx.fillRect(-1, -wheelSize/2 + 1, 2, wheelSize - 2);
    ctx.strokeStyle = carColor.rims;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, wheelSize/2 - 1, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    
    // Rear wheels
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-14, -10 - wheelSize/2, 4, wheelSize);
    ctx.fillRect(-14, 10 - wheelSize/2, 4, wheelSize);
    // Rims
    ctx.fillStyle = carColor.rims;
    ctx.fillRect(-13, -10 - wheelSize/2 + 1, 2, wheelSize - 2);
    ctx.fillRect(-13, 10 - wheelSize/2 + 1, 2, wheelSize - 2);
    
    // Tire marks for drifting wheels
    if (currentCar.isDrifting) {
      ctx.fillStyle = '#444';
      ctx.fillRect(-16, -8, 2, 4);
      ctx.fillRect(-16, 4, 2, 4);
    }
    
    ctx.restore();
  };

  // Enhanced render function
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const currentCar = car.current;
    const track = trackTemplates[selectedTrack];

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background gradient based on track theme
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    if (track.theme === 'night') {
      gradient.addColorStop(0, '#0f0f23');
      gradient.addColorStop(1, '#1a1a2e');
    } else if (track.theme === 'sunset') {
      gradient.addColorStop(0, '#2d1b3d');
      gradient.addColorStop(1, '#1a1a2e');
    } else if (track.theme === 'neon') {
      gradient.addColorStop(0, '#0a0a0a');
      gradient.addColorStop(1, '#1a0a1a');
    } else {
      gradient.addColorStop(0, '#1a1a1a');
      gradient.addColorStop(1, '#2a2a2a');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw track surface with pattern
    ctx.fillStyle = track.surfaceColor || '#2a2a2a';
    const trackX = track.boundaries[1].x + track.boundaries[1].width;
    const trackY = track.boundaries[0].y + track.boundaries[0].height;
    const trackWidth = track.boundaries[3].x - trackX;
    const trackHeight = track.boundaries[2].y - trackY;
    ctx.fillRect(trackX, trackY, trackWidth, trackHeight);

    // Draw track texture/pattern
    ctx.strokeStyle = '#3a3a3a';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    // Draw lane markers
    for (let i = trackX + 50; i < trackX + trackWidth - 50; i += 100) {
      ctx.beginPath();
      ctx.moveTo(i, trackY + 20);
      ctx.lineTo(i, trackY + trackHeight - 20);
      ctx.stroke();
    }
    for (let i = trackY + 50; i < trackY + trackHeight - 50; i += 100) {
      ctx.beginPath();
      ctx.moveTo(trackX + 20, i);
      ctx.lineTo(trackX + trackWidth - 20, i);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Draw track boundaries with enhanced graphics
    ctx.fillStyle = track.boundaryColor || '#ff4444';
    ctx.shadowColor = track.boundaryColor || '#ff4444';
    ctx.shadowBlur = 10;
    track.boundaries.forEach(boundary => {
      ctx.fillRect(boundary.x, boundary.y, boundary.width, boundary.height);
    });
    ctx.shadowBlur = 0;

    // Draw decorative track elements
    if (track.curves) {
      ctx.strokeStyle = track.accentColor || '#666';
      ctx.lineWidth = 3;
      track.curves.forEach(curve => {
        ctx.beginPath();
        ctx.arc(curve.x, curve.y, curve.radius, 0, Math.PI * 2);
        ctx.stroke();
      });
    }

    // Draw start/finish line
    if (track.startLine) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(track.startLine.x, track.startLine.y, track.startLine.width, track.startLine.height);
      ctx.fillStyle = '#000000';
      for (let i = 0; i < track.startLine.width; i += 20) {
        ctx.fillRect(track.startLine.x + i, track.startLine.y, 10, track.startLine.height);
      }
    }

    // Draw particles (drift smoke)
    particlesRef.current.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.life * 0.8;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw customized JDM car
    renderCar(ctx, currentCar);

    // Enhanced drift effects
    if (currentCar.isDrifting) {
      ctx.save();
      ctx.globalAlpha = 0.7;
      const sparkCount = 3;
      for (let i = 0; i < sparkCount; i++) {
        const sparkX = currentCar.x + Math.cos(currentCar.angle + Math.PI) * (20 + i * 10) + (Math.random() - 0.5) * 10;
        const sparkY = currentCar.y + Math.sin(currentCar.angle + Math.PI) * (20 + i * 10) + (Math.random() - 0.5) * 10;
        const sparkSize = 2 + Math.random() * 2;
        
        ctx.fillStyle = i % 2 === 0 ? '#ffaa00' : '#ffffff';
        ctx.beginPath();
        ctx.arc(sparkX, sparkY, sparkSize, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Speed lines when going fast
    if (currentCar.speed > 6) {
      ctx.save();
      ctx.globalAlpha = (currentCar.speed - 6) / 2;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const lineX = currentCar.x - Math.cos(currentCar.angle) * (30 + i * 20);
        const lineY = currentCar.y - Math.sin(currentCar.angle) * (30 + i * 20);
        ctx.beginPath();
        ctx.moveTo(lineX - 5, lineY);
        ctx.lineTo(lineX + 5, lineY);
        ctx.stroke();
      }
      ctx.restore();
    }
  }, [selectedTrack, selectedCar, selectedColor]);

  // Game loop
  const gameLoop = useCallback(() => {
    if (gameState === 'playing') {
      updatePhysics();
      render();
      setTime(prev => prev + 1);
    }
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, updatePhysics, render]);

  // Start game loop
  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop]);

  // Game controls
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTime(0);
    setDriftStreak(0);
    const track = trackTemplates[selectedTrack];
    const carType = carTypes[selectedCar];
    car.current = {
      x: track.startPosition?.x || 400,
      y: track.startPosition?.y || 300,
      angle: track.startPosition?.angle || 0,
      velocity: { x: 0, y: 0 },
      speed: 0,
      maxSpeed: carType.maxSpeed,
      acceleration: carType.acceleration,
      friction: carType.friction,
      turnSpeed: carType.handling,
      isDrifting: false,
      driftAngle: 0,
      wheelAngle: 0
    };
    particlesRef.current = [];
  };

  const pauseGame = () => {
    setGameState(gameState === 'playing' ? 'paused' : 'playing');
  };

  const resetGame = () => {
    setGameState('menu');
    if (score > bestScore) {
      setBestScore(score);
    }
    setScore(0);
    setTime(0);
    setDriftStreak(0);
  };

  const selectTrack = (trackIndex) => {
    setSelectedTrack(trackIndex);
    setGameState('menu');
  };

  const selectCar = (carIndex) => {
    setSelectedCar(carIndex);
  };

  const selectColor = (colorIndex) => {
    setSelectedColor(colorIndex);
  };

  const showMapSelect = () => {
    setGameState('mapSelect');
  };

  const showCarCustomize = () => {
    setGameState('carCustomize');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-6xl">
        {/* Game Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold text-white">Drift Master 2D</h1>
          <div className="flex gap-4">
            <Card className="p-3 bg-gray-800 border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{score}</div>
                <div className="text-sm text-gray-400">Score</div>
              </div>
            </Card>
            <Card className="p-3 bg-gray-800 border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{Math.floor(time / 60)}</div>
                <div className="text-sm text-gray-400">Time</div>
              </div>
            </Card>
            <Card className="p-3 bg-gray-800 border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{bestScore}</div>
                <div className="text-sm text-gray-400">Best</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="border-2 border-gray-700 rounded-lg bg-gray-900"
          />
          
          {/* Main Menu */}
          {gameState === 'menu' && (
            <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center rounded-lg">
              <h2 className="text-6xl font-bold text-white mb-4">DRIFT MASTER</h2>
              <div className="text-center mb-6">
                <p className="text-lg text-gray-300">
                  Pista: <span className="text-orange-400 font-semibold">{trackTemplates[selectedTrack].name}</span>
                </p>
                <p className="text-lg text-gray-300">
                  Carro: <span className="text-blue-400 font-semibold">{carTypes[selectedCar].name}</span>
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  {carTypes[selectedCar].category} • {carColors[selectedColor].name}
                </p>
              </div>
              <div className="flex gap-4 mb-8">
                <Button onClick={startGame} size="lg" className="bg-orange-500 hover:bg-orange-600">
                  <Play className="mr-2" size={20} />
                  Iniciar Jogo
                </Button>
                <Button onClick={showMapSelect} size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
                  <Map className="mr-2" size={20} />
                  Selecionar Pista
                </Button>
                <Button onClick={showCarCustomize} size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
                  <Car className="mr-2" size={20} />
                  Personalizar Carro
                </Button>
              </div>
              <p className="text-sm text-gray-400 text-center max-w-md">
                Use as setas ou WASD para controlar seu carro. Faça drift para pontuar!
              </p>
            </div>
          )}

          {/* Car Customization */}
          {gameState === 'carCustomize' && (
            <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-start rounded-lg p-8 overflow-y-auto">
              <div className="flex items-center mb-6">
                <Button 
                  onClick={() => setGameState('menu')} 
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:bg-gray-700 mr-4"
                >
                  <ArrowLeft size={20} />
                </Button>
                <h2 className="text-3xl font-bold text-white">Garagem JDM</h2>
              </div>
              
              <div className="w-full max-w-6xl">
                {/* Car Selection */}
                <Card className="p-6 bg-gray-800 border-gray-700 mb-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Car className="mr-2 text-blue-400" size={24} />
                    Carros JDM Lendários
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {carTypes.map((carType, index) => (
                      <Card 
                        key={index}
                        className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                          selectedCar === index 
                            ? 'bg-blue-900 border-blue-500 shadow-lg shadow-blue-500/20' 
                            : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                        }`}
                        onClick={() => selectCar(index)}
                      >
                        <div className="text-center">
                          <div className="text-lg font-semibold text-white mb-1">{carType.name}</div>
                          <div className="text-xs text-orange-400 mb-2">{carType.category}</div>
                          <div className="text-sm text-gray-400 mb-3">{carType.description}</div>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span>Velocidade:</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <div key={i} className={`w-2 h-2 rounded-full mr-1 ${i < carType.speedRating ? 'bg-green-400' : 'bg-gray-600'}`} />
                                ))}
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span>Aceleração:</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <div key={i} className={`w-2 h-2 rounded-full mr-1 ${i < carType.accelRating ? 'bg-orange-400' : 'bg-gray-600'}`} />
                                ))}
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span>Manuseio:</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <div key={i} className={`w-2 h-2 rounded-full mr-1 ${i < carType.handlingRating ? 'bg-blue-400' : 'bg-gray-600'}`} />
                                ))}
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span>Drift:</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <div key={i} className={`w-2 h-2 rounded-full mr-1 ${i < carType.driftRating ? 'bg-purple-400' : 'bg-gray-600'}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                          {selectedCar === index && (
                            <div className="mt-3 text-center">
                              <span className="text-blue-400 font-medium">✓ Selecionado</span>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>

                {/* Color Selection */}
                <Card className="p-6 bg-gray-800 border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Palette className="mr-2 text-green-400" size={24} />
                    Cores JDM Clássicas
                  </h3>
                  <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                    {carColors.map((color, index) => (
                      <div 
                        key={index}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 ${
                          selectedColor === index 
                            ? 'ring-2 ring-white' 
                            : 'hover:ring-1 hover:ring-gray-400'
                        }`}
                        style={{ backgroundColor: color.primary }}
                        onClick={() => selectColor(index)}
                      >
                        <div className="text-center">
                          <div className="w-full h-8 rounded mb-2" style={{ 
                            background: `linear-gradient(45deg, ${color.primary}, ${color.secondary})` 
                          }} />
                          <div className="text-xs font-medium text-white">{color.name}</div>
                          {selectedColor === index && (
                            <div className="mt-1 text-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Map Selection */}
          {gameState === 'mapSelect' && (
            <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center rounded-lg p-8">
              <div className="flex items-center mb-6">
                <Button 
                  onClick={() => setGameState('menu')} 
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:bg-gray-700 mr-4"
                >
                  <ArrowLeft size={20} />
                </Button>
                <h2 className="text-3xl font-bold text-white">Selecionar Pista</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                {trackTemplates.map((track, index) => (
                  <Card 
                    key={index}
                    className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                      selectedTrack === index 
                        ? 'bg-orange-900 border-orange-500 shadow-lg shadow-orange-500/20' 
                        : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                    }`}
                    onClick={() => selectTrack(index)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold text-white">{track.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        track.difficulty === 'Fácil' ? 'bg-green-900 text-green-300' :
                        track.difficulty === 'Médio' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-red-900 text-red-300'
                      }`}>
                        {track.difficulty}
                      </span>
                    </div>
                    
                    {/* Mini track preview */}
                    <div className="bg-gray-900 rounded h-24 mb-3 relative overflow-hidden">
                      <div 
                        className="absolute inset-2 rounded"
                        style={{ backgroundColor: track.surfaceColor || '#2a2a2a' }}
                      >
                        <div 
                          className="absolute inset-0 border-2 rounded"
                          style={{ borderColor: track.boundaryColor || '#ff4444' }}
                        />
                        {track.curves && track.curves.map((curve, i) => (
                          <div
                            key={i}
                            className="absolute border border-gray-600 rounded-full"
                            style={{
                              left: `${(curve.x / 800) * 100}%`,
                              top: `${(curve.y / 600) * 100}%`,
                              width: `${(curve.radius / 400) * 100}%`,
                              height: `${(curve.radius / 300) * 100}%`,
                              transform: 'translate(-50%, -50%)'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-gray-400 text-sm">{track.description}</p>
                    
                    {selectedTrack === index && (
                      <div className="mt-3 text-center">
                        <span className="text-orange-400 font-medium">✓ Selecionada</span>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {gameState === 'paused' && (
            <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center rounded-lg">
              <h2 className="text-4xl font-bold text-white mb-4">PAUSADO</h2>
              <Button onClick={pauseGame} size="lg" className="bg-blue-500 hover:bg-blue-600">
                <Play className="mr-2" size={20} />
                Continuar
              </Button>
            </div>
          )}

          {/* Drift Indicator */}
          {gameState === 'playing' && driftStreak > 0 && (
            <div className="absolute top-4 left-4">
              <Card className="p-3 bg-orange-500 bg-opacity-90 border-orange-400 animate-pulse">
                <div className="text-white font-bold">
                  <div className="text-lg">DRIFT!</div>
                  <div className="text-sm">Streak: {driftStreak}</div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Game Controls */}
        <div className="flex justify-center gap-4 mt-4">
          <Button 
            onClick={pauseGame} 
            disabled={gameState !== 'playing'}
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-700"
          >
            <Pause className="mr-2" size={20} />
            Pausar
          </Button>
          <Button 
            onClick={resetGame}
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-700"
          >
            <RotateCcw className="mr-2" size={20} />
            Resetar
          </Button>
        </div>

        {/* Instructions */}
        <Card className="mt-6 p-4 bg-gray-800 border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Garagem JDM:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <div>
              <p><strong>Carros Disponíveis:</strong></p>
              <p>• Mazda RX-7 FD - Lenda rotativa</p>
              <p>• Nissan Skyline R34 GT-R - Godzilla</p>
              <p>• Toyota Supra MK4 - 2JZ Power</p>
              <p>• Toyota AE86 - Hachiroku King</p>
              <p>• Mitsubishi Evo IX - Rally Beast</p>
              <p>• E muito mais!</p>
            </div>
            <div>
              <p><strong>Características:</strong></p>
              <p>• Cada carro tem design único</p>
              <p>• Física personalizada por modelo</p>
              <p>• 15 cores JDM clássicas</p>
              <p>• Stats realistas de performance</p>
              <p>• Efeitos visuais especiais</p>
              <p>• Multiplicadores de drift únicos</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GameCanvas;