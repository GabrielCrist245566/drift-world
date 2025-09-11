import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import axios from 'axios';
import { 
  Trophy, 
  ArrowLeft, 
  Crown, 
  Medal, 
  Star,
  Calendar,
  Car,
  Target,
  Users,
  TrendingUp
} from 'lucide-react';

const Leaderboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [globalLeaderboard, setGlobalLeaderboard] = useState([]);
  const [trackLeaderboards, setTrackLeaderboards] = useState({});
  const [selectedTrack, setSelectedTrack] = useState('Circuito Alpha');
  const [loading, setLoading] = useState(true);

  const tracks = [
    'Circuito Alpha',
    'Arena Neon',
    'Velocidade Noturna',
    'Pôr do Sol',
    'Montanha Drift'
  ];

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  const fetchLeaderboards = async () => {
    try {
      // Fetch global leaderboard
      const globalRes = await axios.get('/leaderboard/global?limit=20');
      setGlobalLeaderboard(globalRes.data);

      // Fetch track-specific leaderboards
      const trackPromises = tracks.map(async (track) => {
        const trackRes = await axios.get(`/leaderboard/track/${encodeURIComponent(track)}?limit=10`);
        return { track, data: trackRes.data };
      });

      const trackResults = await Promise.all(trackPromises);
      const trackData = {};
      trackResults.forEach(({ track, data }) => {
        trackData[track] = data;
      });
      setTrackLeaderboards(trackData);

    } catch (error) {
      console.error('Error fetching leaderboards:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Star className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRankBadgeClass = (rank) => {
    switch (rank) {
      case 1:
        return 'rank-1';
      case 2:
        return 'rank-2';
      case 3:
        return 'rank-3';
      default:
        return 'rank-other';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  const isCurrentUser = (username) => {
    return user?.username === username;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">Carregando ranking...</div>
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
              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div className="h-8 w-px bg-gray-600"></div>
              <h1 className="gaming-title text-3xl neon-orange">RANKING GLOBAL</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-orange-400 text-sm flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Atualizado em tempo real
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="global" className="w-full">
          <TabsList className="bg-gray-800 border border-gray-600 mb-8">
            <TabsTrigger 
              value="global" 
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Ranking Global
            </TabsTrigger>
            <TabsTrigger 
              value="tracks" 
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              <Target className="w-4 h-4 mr-2" />
              Por Pista
            </TabsTrigger>
          </TabsList>

          {/* Global Leaderboard */}
          <TabsContent value="global">
            <Card className="gaming-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="gaming-subtitle text-2xl">Os Melhores Pilotos do Mundo</h2>
                <div className="flex items-center space-x-2 text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{globalLeaderboard.length} registros</span>
                </div>
              </div>

              {globalLeaderboard.length > 0 ? (
                <div className="space-y-3">
                  {globalLeaderboard.map((entry, index) => (
                    <div 
                      key={`${entry.username}-${entry.score}-${index}`}
                      className={`leaderboard-entry ${isCurrentUser(entry.username) ? 'border-orange-500 bg-orange-500/10' : ''}`}
                    >
                      <div className={`rank-badge ${getRankBadgeClass(entry.rank)}`}>
                        {entry.rank <= 3 ? getRankIcon(entry.rank) : entry.rank}
                      </div>
                      
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                        <div className="md:col-span-2">
                          <div className="flex items-center space-x-3">
                            <div>
                              <div className={`font-bold ${isCurrentUser(entry.username) ? 'text-orange-400' : 'text-white'}`}>
                                {entry.username}
                                {isCurrentUser(entry.username) && (
                                  <span className="ml-2 text-xs bg-orange-500 px-2 py-0.5 rounded-full">
                                    VOCÊ
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-400 flex items-center">
                                <Car className="w-3 h-3 mr-1" />
                                {entry.car_used}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-2xl font-bold neon-orange">
                            {entry.score.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-400">pontos</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-white font-semibold">{entry.track_name}</div>
                          <div className="text-xs text-gray-400">{entry.color_used}</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-gray-300 flex items-center justify-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(entry.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                  <p className="text-gray-400 text-lg">Nenhum score registrado ainda.</p>
                  <p className="text-gray-500">Seja o primeiro a aparecer no ranking!</p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Track Leaderboards */}
          <TabsContent value="tracks">
            <div className="space-y-6">
              {/* Track Selector */}
              <Card className="gaming-card p-4">
                <div className="flex flex-wrap gap-2">
                  {tracks.map((track) => (
                    <Button
                      key={track}
                      onClick={() => setSelectedTrack(track)}
                      variant={selectedTrack === track ? "default" : "outline"}
                      className={selectedTrack === track 
                        ? "gaming-button" 
                        : "border-gray-600 text-white hover:bg-gray-700"
                      }
                    >
                      {track}
                    </Button>
                  ))}
                </div>
              </Card>

              {/* Selected Track Leaderboard */}
              <Card className="gaming-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="gaming-subtitle text-2xl">
                    Ranking - <span className="neon-orange">{selectedTrack}</span>
                  </h2>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Target className="w-4 h-4" />
                    <span>{trackLeaderboards[selectedTrack]?.length || 0} registros</span>
                  </div>
                </div>

                {trackLeaderboards[selectedTrack]?.length > 0 ? (
                  <div className="space-y-3">
                    {trackLeaderboards[selectedTrack].map((entry, index) => (
                      <div 
                        key={`${entry.username}-${entry.score}-${index}`}
                        className={`leaderboard-entry ${isCurrentUser(entry.username) ? 'border-orange-500 bg-orange-500/10' : ''}`}
                      >
                        <div className={`rank-badge ${getRankBadgeClass(entry.rank)}`}>
                          {entry.rank <= 3 ? getRankIcon(entry.rank) : entry.rank}
                        </div>
                        
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                          <div className="md:col-span-2">
                            <div className={`font-bold ${isCurrentUser(entry.username) ? 'text-orange-400' : 'text-white'}`}>
                              {entry.username}
                              {isCurrentUser(entry.username) && (
                                <span className="ml-2 text-xs bg-orange-500 px-2 py-0.5 rounded-full">
                                  VOCÊ
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-400 flex items-center">
                              <Car className="w-3 h-3 mr-1" />
                              {entry.car_used} • {entry.color_used}
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-2xl font-bold neon-orange">
                              {entry.score.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-400">pontos</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-gray-300 flex items-center justify-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(entry.created_at)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Target className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400 text-lg">Nenhum score para {selectedTrack} ainda.</p>
                    <p className="text-gray-500">Seja o primeiro a dominar esta pista!</p>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Leaderboard;
