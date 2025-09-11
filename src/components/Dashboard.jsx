import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';
import axios from 'axios';
import { 
  Car, 
  Trophy, 
  Users, 
  Play, 
  Target, 
  Award, 
  TrendingUp,
  Clock,
  Zap,
  LogOut,
  User,
  BarChart3
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentMatches, setRecentMatches] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, matchesRes, usersRes] = await Promise.all([
        axios.get('/user/stats'),
        axios.get('/user/matches?limit=5'),
        axios.get('/users/online')
      ]);

      setStats(statsRes.data);
      setRecentMatches(matchesRes.data);
      setOnlineUsers(usersRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const getLevelProgress = () => {
    if (!stats) return 0;
    const currentLevelExp = (stats.level - 1) * 1000;
    const nextLevelExp = stats.level * 1000;
    return ((stats.experience - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">Carregando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="gaming-title text-3xl neon-orange">DRIFT WORLD</h1>
              <div className="h-8 w-px bg-gray-600"></div>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-orange-400" />
                <span className="text-white font-semibold">{user?.username}</span>
                <span className="text-orange-400 text-sm">Nível {user?.level}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-green-400 text-sm flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                {onlineUsers.length} online
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Bem-vindo de volta, <span className="neon-orange">{user?.username}</span>!
          </h2>
          <p className="text-gray-400">
            Pronto para mais drift? Vamos acelerar!
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Button
            onClick={() => navigate('/game')}
            className="gaming-button h-16 text-lg"
          >
            <Play className="w-6 h-6 mr-2" />
            JOGAR SOLO
          </Button>
          
          <Button
            onClick={() => navigate('/multiplayer')}
            className="gaming-button-secondary h-16 text-lg"
          >
            <Users className="w-6 h-6 mr-2" />
            MULTIJOGADOR
          </Button>
          
          <Button
            onClick={() => navigate('/leaderboard')}
            className="gaming-button-secondary h-16 text-lg"
          >
            <Trophy className="w-6 h-6 mr-2" />
            RANKING
          </Button>
          
          <Button
            onClick={() => navigate('/game')}
            className="gaming-button-secondary h-16 text-lg"
          >
            <Target className="w-6 h-6 mr-2" />
            TREINO
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Player Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Level Progress */}
            <Card className="gaming-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="gaming-subtitle text-xl">Progresso do Piloto</h3>
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-bold">Nível {stats?.level}</span>
                </div>
              </div>
              
              <div className="level-progress mb-4">
                <div 
                  className="level-progress-fill" 
                  style={{ width: `${getLevelProgress()}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-400">
                <span>{stats?.experience} XP</span>
                <span>{stats?.level * 1000} XP</span>
              </div>
            </Card>

            {/* Performance Stats */}
            <Card className="gaming-card p-6">
              <h3 className="gaming-subtitle text-xl mb-6">Estatísticas de Performance</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="stat-display">
                  <div className="stat-value neon-orange">{stats?.total_score.toLocaleString()}</div>
                  <div className="stat-label">Pontos Total</div>
                </div>
                
                <div className="stat-display">
                  <div className="stat-value neon-blue">{stats?.best_score.toLocaleString()}</div>
                  <div className="stat-label">Melhor Score</div>
                </div>
                
                <div className="stat-display">
                  <div className="stat-value neon-green">{stats?.games_played}</div>
                  <div className="stat-label">Partidas</div>
                </div>
                
                <div className="stat-display">
                  <div className="stat-value neon-purple">{Math.round(stats?.average_score)}</div>
                  <div className="stat-label">Média</div>
                </div>
              </div>
            </Card>

            {/* Recent Matches */}
            <Card className="gaming-card p-6">
              <h3 className="gaming-subtitle text-xl mb-6">Partidas Recentes</h3>
              
              {recentMatches.length > 0 ? (
                <div className="space-y-3">
                  {recentMatches.map((match, index) => (
                    <div key={match.id} className="leaderboard-entry">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-semibold text-white">{match.track_name}</span>
                              <span className="text-gray-400 ml-2">• {match.car_used}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-orange-400 font-bold">{match.score.toLocaleString()}</div>
                              <div className="text-xs text-gray-400">
                                {formatTime(match.game_duration)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">
                  Nenhuma partida ainda. Que tal começar agora?
                </p>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Online Users */}
            <Card className="gaming-card p-6">
              <h3 className="gaming-subtitle text-lg mb-4">Pilotos Online</h3>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {onlineUsers.slice(0, 10).map((onlineUser) => (
                  <div key={onlineUser.id} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="text-white text-sm">{onlineUser.username}</div>
                      <div className="text-xs text-gray-400">Nível {onlineUser.level}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {onlineUsers.length > 10 && (
                <div className="text-center mt-4">
                  <span className="text-xs text-gray-400">
                    +{onlineUsers.length - 10} mais online
                  </span>
                </div>
              )}
            </Card>

            {/* Achievements */}
            <Card className="gaming-card p-6">
              <h3 className="gaming-subtitle text-lg mb-4">Conquistas</h3>
              
              <div className="space-y-3">
                {stats?.achievements?.length > 0 ? (
                  stats.achievements.slice(0, 5).map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-yellow-400" />
                      <span className="text-white text-sm">{achievement}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">
                    Jogue mais para desbloquear conquistas!
                  </p>
                )}
              </div>
            </Card>

            {/* Quick Links */}
            <Card className="gaming-card p-6">
              <h3 className="gaming-subtitle text-lg mb-4">Links Rápidos</h3>
              
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/leaderboard')}
                  variant="outline"
                  className="w-full border-gray-600 text-white hover:bg-gray-700"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Ver Ranking Completo
                </Button>
                
                <Button
                  onClick={() => navigate('/multiplayer')}
                  variant="outline"
                  className="w-full border-gray-600 text-white hover:bg-gray-700"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Salas Multijogador
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
