
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Bot, CreditCard, Eye, Clock, Users } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    chatbotEnabled: true,
    videoSolutionsVisible: true,
    buyTestButtonEnabled: true,
    adaptiveTestingEnabled: true,
    timerEnabled: true,
    breakAllowed: false,
    passThreshold: 70,
    hardModeThreshold: 85,
    easyModeThreshold: 50,
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-sm md:text-base text-gray-600">Configure platform settings and features</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="general" className="text-xs md:text-sm">General</TabsTrigger>
          <TabsTrigger value="testing" className="text-xs md:text-sm">Testing</TabsTrigger>
          <TabsTrigger value="ui" className="text-xs md:text-sm">UI Controls</TabsTrigger>
          <TabsTrigger value="adaptive" className="text-xs md:text-sm">Adaptive</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 md:space-y-6 mt-4 md:mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Bot className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                Chatbot Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <Label htmlFor="chatbot-enabled" className="text-sm md:text-base">Enable Chatbot</Label>
                  <p className="text-xs md:text-sm text-gray-500">Allow students to interact with the AI chatbot</p>
                </div>
                <Switch
                  id="chatbot-enabled"
                  checked={settings.chatbotEnabled}
                  onCheckedChange={(value) => handleSettingChange('chatbotEnabled', value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="chatbot-message" className="text-sm md:text-base">Default Chatbot Message</Label>
                <Textarea
                  id="chatbot-message"
                  placeholder="Hi! I'm here to help you with Number Nerd Academy..."
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                Payment Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <Label htmlFor="buy-test-enabled" className="text-sm md:text-base">Show Buy Test Buttons</Label>
                  <p className="text-xs md:text-sm text-gray-500">Display purchase buttons for premium tests</p>
                </div>
                <Switch
                  id="buy-test-enabled"
                  checked={settings.buyTestButtonEnabled}
                  onCheckedChange={(value) => handleSettingChange('buyTestButtonEnabled', value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4 md:space-y-6 mt-4 md:mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                Test Timer Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <Label htmlFor="timer-enabled" className="text-sm md:text-base">Enable Test Timer</Label>
                  <p className="text-xs md:text-sm text-gray-500">Show countdown timer during tests</p>
                </div>
                <Switch
                  id="timer-enabled"
                  checked={settings.timerEnabled}
                  onCheckedChange={(value) => handleSettingChange('timerEnabled', value)}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <Label htmlFor="break-allowed" className="text-sm md:text-base">Allow Breaks</Label>
                  <p className="text-xs md:text-sm text-gray-500">Allow students to pause tests</p>
                </div>
                <Switch
                  id="break-allowed"
                  checked={settings.breakAllowed}
                  onCheckedChange={(value) => handleSettingChange('breakAllowed', value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pass-threshold" className="text-sm md:text-base">Pass Threshold (%)</Label>
                  <Input
                    id="pass-threshold"
                    type="number"
                    value={settings.passThreshold}
                    onChange={(e) => handleSettingChange('passThreshold', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-attempts" className="text-sm md:text-base">Max Attempts per Test</Label>
                  <Input
                    id="max-attempts"
                    type="number"
                    placeholder="3"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ui" className="space-y-4 md:space-y-6 mt-4 md:mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Eye className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                UI Visibility Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <Label htmlFor="video-solutions" className="text-sm md:text-base">Show Video Solutions</Label>
                  <p className="text-xs md:text-sm text-gray-500">Display video explanations for answers</p>
                </div>
                <Switch
                  id="video-solutions"
                  checked={settings.videoSolutionsVisible}
                  onCheckedChange={(value) => handleSettingChange('videoSolutionsVisible', value)}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <Label htmlFor="written-solutions" className="text-sm md:text-base">Written Solution Improvement Box</Label>
                  <p className="text-xs md:text-sm text-gray-500">Show improvement suggestions for paid tests</p>
                </div>
                <Switch
                  id="written-solutions"
                  checked={true}
                  onCheckedChange={() => {}}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <Label htmlFor="leaderboard" className="text-sm md:text-base">Show Leaderboard</Label>
                  <p className="text-xs md:text-sm text-gray-500">Display student rankings</p>
                </div>
                <Switch
                  id="leaderboard"
                  checked={true}
                  onCheckedChange={() => {}}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adaptive" className="space-y-4 md:space-y-6 mt-4 md:mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Users className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                Adaptive Testing Logic
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <Label htmlFor="adaptive-enabled" className="text-sm md:text-base">Enable Adaptive Testing</Label>
                  <p className="text-xs md:text-sm text-gray-500">Automatically adjust difficulty based on performance</p>
                </div>
                <Switch
                  id="adaptive-enabled"
                  checked={settings.adaptiveTestingEnabled}
                  onCheckedChange={(value) => handleSettingChange('adaptiveTestingEnabled', value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hard-threshold" className="text-sm md:text-base">Hard Mode Threshold (%)</Label>
                  <Input
                    id="hard-threshold"
                    type="number"
                    value={settings.hardModeThreshold}
                    onChange={(e) => handleSettingChange('hardModeThreshold', parseInt(e.target.value))}
                  />
                  <p className="text-xs text-gray-500">Show harder questions above this score</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="easy-threshold" className="text-sm md:text-base">Easy Mode Threshold (%)</Label>
                  <Input
                    id="easy-threshold"
                    type="number"
                    value={settings.easyModeThreshold}
                    onChange={(e) => handleSettingChange('easyModeThreshold', parseInt(e.target.value))}
                  />
                  <p className="text-xs text-gray-500">Show easier questions below this score</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="manual-override" className="text-sm md:text-base">Manual Score Override for Testing</Label>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <Input placeholder="User ID" className="text-sm" />
                  <Input placeholder="Test ID" className="text-sm" />
                  <Input placeholder="Override Score" type="number" className="text-sm" />
                  <Button variant="outline" size="sm" className="text-sm">Apply</Button>
                </div>
                <p className="text-xs text-gray-500">Override scores for testing adaptive flow</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
