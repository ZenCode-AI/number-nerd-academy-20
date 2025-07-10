
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { User, Mail, Phone, Calendar, BookOpen, Award, Target, Clock, GraduationCap, School, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const StudentProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || 'Student User',
    email: user?.email || 'student@example.com',
    phone: '+1 234 567 8900',
    joinDate: '2024-01-15',
    plan: user?.plan || 'Standard',
    avatar: '',
    bio: 'Passionate learner focused on improving mathematical skills and academic performance.',
    grade: '10th Grade',
    school: 'Lincoln High School'
  });

  const stats = [
    { label: 'Tests', value: '24', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50', progress: 75 },
    { label: 'Avg Score', value: '87%', icon: Award, color: 'text-green-600', bg: 'bg-green-50', progress: 87 },
    { label: 'Streak', value: '12 days', icon: Target, color: 'text-purple-600', bg: 'bg-purple-50', progress: 60 },
    { label: 'Study Time', value: '48 hrs', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50', progress: 45 },
  ];

  const achievements = [
    { name: 'First Test', description: 'Completed your first test', earned: true },
    { name: 'Perfect Score', description: 'Achieved 100% on a test', earned: true },
    { name: 'Study Streak', description: '7 days in a row', earned: true },
    { name: 'High Achiever', description: '90%+ average score', earned: false },
  ];

  const handleSave = () => {
    setIsEditing(false);
    console.log('Saving profile:', profile);
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Premium': return 'bg-purple-100 text-purple-800';
      case 'Standard': return 'bg-blue-100 text-blue-800';
      case 'Basic': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Main Profile Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              Student Profile
            </CardTitle>
            <Badge className={`${getPlanColor(profile.plan)} font-semibold w-fit`}>
              {profile.plan} Plan
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Avatar Section */}
            <div className="lg:col-span-3 flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback className="text-2xl bg-blue-50 text-blue-700">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} size="sm" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-9">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="grade" className="text-sm font-medium">Grade</Label>
                      <Input
                        id="grade"
                        value={profile.grade}
                        onChange={(e) => setProfile({ ...profile, grade: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="school" className="text-sm font-medium">School</Label>
                      <Input
                        id="school"
                        value={profile.school}
                        onChange={(e) => setProfile({ ...profile, school: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium">About Me</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button onClick={handleSave}>Save Changes</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Name</p>
                        <p className="font-semibold text-gray-900">{profile.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-gray-700">{profile.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-gray-700">{profile.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Member Since</p>
                        <p className="text-gray-700">{new Date(profile.joinDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                      <GraduationCap className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Grade</p>
                        <p className="font-medium text-gray-900">{profile.grade}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                      <School className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">School</p>
                        <p className="font-medium text-gray-900">{profile.school}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-xs text-gray-500 mb-1">About</p>
                    <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-600">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <div className="space-y-1">
                  <Progress value={stat.progress} className="h-1.5" />
                  <p className="text-xs text-gray-500">{stat.progress}% progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievements */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-6 h-6 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Award className="h-3 w-3 text-yellow-600" />
            </div>
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-4 rounded-lg border transition-colors ${
                  achievement.earned
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  achievement.earned ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Award className={`h-5 w-5 ${
                    achievement.earned ? 'text-green-600' : 'text-gray-400'
                  }`} />
                </div>
                <div>
                  <p className={`font-semibold ${
                    achievement.earned ? 'text-green-900' : 'text-gray-500'
                  }`}>
                    {achievement.name}
                  </p>
                  <p className={`text-sm ${
                    achievement.earned ? 'text-green-700' : 'text-gray-400'
                  }`}>
                    {achievement.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfile;
