import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Trophy, Clock, Calendar, User } from 'lucide-react';
import { mockLeaderboard, mockPlayerStats } from './mock';

const Leaderboard = ({ onBack }) => {
  const [selectedTab, setSelectedTab] = useState('leaderboard');

  const formatTime = (minutes, seconds) => {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Rankings</h2>
        <Button 
          onClick={onBack}
          variant="outline"
          className="border-gray-600 text-white hover:bg-gray-700"
        >
          Voltar ao Jogo
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <Button
          onClick={() => setSelectedTab('leaderboard')}
          variant={selectedTab === 'leaderboard' ? 'default' : 'outline'}
          className={selectedTab === 'leaderboard' 
            ? 'bg-orange-500 hover:bg-orange-600' 
            : 'border-gray-600 text-white hover:bg-gray-700'
          }
        >
          <Trophy className="mr-2" size={16} />
          Leaderboard
        </Button>
        <Button
          onClick={() => setSelectedTab('stats')}
          variant={selectedTab === 'stats' ? 'default' : 'outline'}
          className={selectedTab === 'stats' 
            ? 'bg-orange-500 hover:bg-orange-600' 
            : 'border-gray-600 text-white hover:bg-gray-700'
          }
        >
          <User className="mr-2" size={16} />
          Suas Estatísticas
        </Button>
      </div>

      {selectedTab === 'leaderboard' && (
        <Card className="p-6 bg-gray-800 border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Trophy className="mr-2 text-yellow-400" size={24} />
            Top Players
          </h3>
          <div className="space-y-3">
            {mockLeaderboard.map((player, index) => (
              <div 
                key={player.id}
                className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${
                  index === 0 ? 'bg-yellow-900 bg-opacity-30 border border-yellow-600' :
                  index === 1 ? 'bg-gray-700 bg-opacity-50 border border-gray-600' :
                  index === 2 ? 'bg-orange-900 bg-opacity-30 border border-orange-600' :
                  'bg-gray-700 bg-opacity-30 hover:bg-gray-700 hover:bg-opacity-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-yellow-500 text-black' :
                    index === 1 ? 'bg-gray-400 text-black' :
                    index === 2 ? 'bg-orange-500 text-black' :
                    'bg-gray-600 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{player.playerName}</div>
                    <div className="text-sm text-gray-400 flex items-center gap-2">
                      <Calendar size={14} />
                      {player.date}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-orange-400">
                    {player.score.toLocaleString()} pts
                  </div>
                  <div className="text-sm text-gray-400 flex items-center gap-1">
                    <Clock size={14} />
                    {formatTime(player.timeMinutes, player.timeSeconds)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {selectedTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-gray-800 border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Estatísticas Gerais</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Jogos Jogados:</span>
                <span className="text-white font-semibold">{mockPlayerStats.gamesPlayed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Melhor Pontuação:</span>
                <span className="text-orange-400 font-semibold">
                  {mockPlayerStats.bestScore.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Pontuação Média:</span>
                <span className="text-white font-semibold">
                  {mockPlayerStats.averageScore.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Distância Total:</span>
                <span className="text-white font-semibold">
                  {mockPlayerStats.totalDistance.toLocaleString()}m
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-800 border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Recordes de Drift</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Tempo Total de Drift:</span>
                <span className="text-blue-400 font-semibold">
                  {Math.floor(mockPlayerStats.totalDriftTime / 60)}m {mockPlayerStats.totalDriftTime % 60}s
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Pista Favorita:</span>
                <span className="text-white font-semibold">{mockPlayerStats.favoriteTrack}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Taxa de Drift:</span>
                <span className="text-green-400 font-semibold">87%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Maior Sequência:</span>
                <span className="text-purple-400 font-semibold">245 pontos</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-800 border-gray-700 md:col-span-2">
            <h3 className="text-xl font-semibold text-white mb-4">Progresso</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">Novato</div>
                <div className="text-sm text-gray-400">Nível Atual</div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">12</div>
                <div className="text-sm text-gray-400">Conquistas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">89%</div>
                <div className="text-sm text-gray-400">Precisão</div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;