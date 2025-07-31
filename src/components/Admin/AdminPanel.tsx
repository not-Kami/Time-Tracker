import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Settings, BarChart3, Activity, Globe, FileText, Plus, Eye, EyeOff, Edit, Trash2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { SkillsManager } from './SkillsManager';
import { getDefaultCategories, getTrendingSkills } from '../../utils/defaultData';
import { DefaultCategory, DefaultSkill, UserProfile } from '../../types';
import { supabase } from '../../lib/supabase';

interface AdminPanelProps {
  onBack: () => void;
  userProfile?: UserProfile;
}

export function AdminPanel({ onBack, userProfile }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'categories' | 'skills' | 'users' | 'articles' | 'analytics'>('overview');
  const [users, setUsers] = useState<any[]>([]);
  const [userData, setUserData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [defaultCategories, setDefaultCategories] = useState<DefaultCategory[]>([]);
  const [trendingSkills, setTrendingSkills] = useState<DefaultSkill[]>([]);
  const { t } = useLanguage();

  // Charger les données utilisateurs et analytics
  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // Charger les utilisateurs depuis la table users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) {
        console.error('Error loading users:', usersError);
      } else {
        setUsers(usersData || []);
      }

      // Charger les données utilisateur depuis user_data
      const { data: userDataResult, error: userDataError } = await supabase
        .from('user_data')
        .select('*');

      if (userDataError) {
        console.error('Error loading user data:', userDataError);
      } else {
        setUserData(userDataResult || []);
      }

      // Charger les catégories par défaut
      const categories = getDefaultCategories();
      setDefaultCategories(categories);

      // Charger les skills trending
      const trending = getTrendingSkills();
      setTrendingSkills(trending);

    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculer les statistiques
  const stats = {
    totalUsers: users.length,
    activeUsers: userData.filter(data => {
      const lastActivity = new Date(data.updated_at);
      const now = new Date();
      const daysSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceActivity <= 7; // Actif dans les 7 derniers jours
    }).length,
    totalCategories: defaultCategories.length,
    trendingSkills: trendingSkills.length,
    totalProjects: userData.reduce((sum, data) => {
      return sum + (data.data?.projects?.length || 0);
    }, 0),
    totalSessions: userData.reduce((sum, data) => {
      return sum + (data.data?.sessions?.length || 0);
    }, 0),
  };

  // Gestion des catégories par défaut
  const handleToggleCategoryStatus = (categoryId: string) => {
    setDefaultCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, isActive: !cat.isActive }
          : cat
      )
    );
  };

  const handleToggleSkillTrending = (categoryId: string, skillId: string) => {
    setDefaultCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId 
          ? {
              ...cat,
              skills: cat.skills.map(skill =>
                skill.id === skillId
                  ? { ...skill, isTrending: !skill.isTrending }
                  : skill
              )
            }
          : cat
      )
    );
  };

  // Gestion des utilisateurs
  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: isActive })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user status:', error);
      } else {
        setUsers(prev => 
          prev.map(user => 
            user.id === userId 
              ? { ...user, is_active: isActive }
              : user
          )
        );
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t('admin.loadingAdminData')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                ← Back to App
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Panel
              </h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Globe className="w-4 h-4" />
              <span>Admin: {userProfile?.nickname || userProfile?.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: t('admin.overview'), icon: BarChart3 },
              { id: 'categories', name: t('admin.categories'), icon: Settings },
              { id: 'skills', name: t('admin.skills.title'), icon: TrendingUp },
              { id: 'users', name: t('admin.users'), icon: Users },
              { id: 'articles', name: t('admin.articles'), icon: FileText },
              { id: 'analytics', name: t('admin.analytics'), icon: Activity },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('admin.skills.totalUsers')}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('admin.active')} {t('admin.users')}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('admin.categories')}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCategories}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('admin.trendingSkills')}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.trendingSkills}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('projects.title')}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProjects}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('timer.currentSession')}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSessions}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Users */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('admin.recentUsers')}</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {user.nickname?.charAt(0) || user.email?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {user.nickname || user.email}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(user.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                                                 <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                           user.is_active 
                             ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                             : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                         }`}>
                           {user.is_active ? t('admin.active') : t('admin.inactive')}
                         </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Trending Skills */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('admin.trendingSkills')}</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {trendingSkills.slice(0, 5).map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{skill.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {skill.trendingReason}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          skill.difficulty === 'beginner' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                          skill.difficulty === 'intermediate' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                          skill.difficulty === 'advanced' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' :
                          'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200'
                        }`}>
                          {skill.difficulty}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin.defaultCategories')}</h2>
                <p className="text-gray-600 dark:text-gray-400">{t('admin.manageDefaultCategories')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {defaultCategories.map((category) => (
                <div key={category.id} className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg bg-${category.color}-100 dark:bg-${category.color}-900 flex items-center justify-center`}>
                          <span className="text-lg">{category.icon}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                                                     <p className="text-sm text-gray-500 dark:text-gray-400">
                             {category.skills.length} {t('admin.skills')}
                           </p>
                        </div>
                      </div>
                                             <button
                         onClick={() => handleToggleCategoryStatus(category.id)}
                         className={`px-3 py-1 text-xs font-semibold rounded-full ${
                           category.isActive
                             ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                             : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                         }`}
                       >
                         {category.isActive ? t('admin.active') : t('admin.inactive')}
                       </button>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {category.description}
                    </p>

                                         <div className="space-y-2">
                       <h4 className="text-sm font-medium text-gray-900 dark:text-white">{t('admin.skills.title')}:</h4>
                      {category.skills.map((skill) => (
                        <div key={skill.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{skill.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{skill.difficulty}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {skill.isTrending && (
                                                           <span className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                               <TrendingUp size={12} />
                               {t('admin.trending')}
                             </span>
                            )}
                            <button
                              onClick={() => handleToggleSkillTrending(category.id, skill.id)}
                              className={`p-1 rounded ${
                                skill.isTrending 
                                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                              }`}
                            >
                              <TrendingUp size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <SkillsManager
            skills={[]} // Mock data - would come from API
            onAddSkill={() => {}}
            onUpdateSkill={() => {}}
            onDeleteSkill={() => {}}
            onToggleSkillStatus={() => {}}
          />
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin.userManagement')}</h2>
                <p className="text-gray-600 dark:text-gray-400">{t('admin.manageUsers')}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('admin.users')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('admin.skills.category')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('admin.skills.status')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('admin.joined')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('admin.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                {user.nickname?.charAt(0) || user.email?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.nickname || t('admin.noNickname')}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                          }`}>
                            {user.role || 'user'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleUserStatus(user.id, !user.is_active)}
                            className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                              user.is_active
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                            }`}
                          >
                            {user.is_active ? (
                              <>
                                <Eye className="w-3 h-3 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3 mr-1" />
                                Inactive
                              </>
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'articles' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('admin.articleManagement')}</h3>
                <p className="text-gray-500 dark:text-gray-400">{t('admin.createManageArticles')}</p>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                <span>{t('admin.createArticle')}</span>
              </button>
            </div>
            <p className="text-gray-500 dark:text-gray-400">Article management features coming soon...</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('admin.advancedAnalytics')}</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Growth Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('admin.userGrowth')}</h4>
                <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">{t('admin.chartComingSoon')}</p>
                </div>
              </div>

              {/* Skill Popularity Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('admin.skillPopularity')}</h4>
                <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">{t('admin.chartComingSoon')}</p>
                </div>
              </div>

              {/* Time Tracking Analytics */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('admin.timeTrackingAnalytics')}</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">{t('admin.totalHoursTracked')}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {userData.reduce((sum, data) => {
                        const sessions = data.data?.sessions || [];
                        return sum + sessions.reduce((sessionSum, session) => sessionSum + (session.duration || 0), 0);
                      }, 0) / 3600} {t('admin.hours')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">{t('admin.averageSessionLength')}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {(() => {
                        const totalSessions = userData.reduce((sum, data) => sum + (data.data?.sessions?.length || 0), 0);
                        const totalDuration = userData.reduce((sum, data) => {
                          const sessions = data.data?.sessions || [];
                          return sum + sessions.reduce((sessionSum, session) => sessionSum + (session.duration || 0), 0);
                        }, 0);
                        return totalSessions > 0 ? Math.round(totalDuration / totalSessions / 60) : 0;
                      })()} {t('admin.minutes')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Category Distribution */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('admin.categoryDistribution')}</h4>
                <div className="space-y-3">
                  {defaultCategories.slice(0, 5).map((category) => {
                    const categoryUsers = userData.filter(data => 
                      data.data?.categories?.some((cat: any) => cat.name === category.name)
                    ).length;
                    const percentage = users.length > 0 ? (categoryUsers / users.length) * 100 : 0;
                    
                    return (
                      <div key={category.id} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{category.name}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round(percentage)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 