import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export default function ProfilePage() {
  const { user, getMyProfile, saveMyProfile } = useApp();
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ title: '', bio: '', skills: '', hourlyRate: '', location: '', avatar: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await getMyProfile();
      if (res.ok && res.profile) {
        setProfile(res.profile);
        setForm({
          title: res.profile.title || '',
          bio: res.profile.bio || '',
          skills: (res.profile.skills || []).join(', '),
          hourlyRate: res.profile.hourlyRate || '',
          location: res.profile.location || '',
          avatar: res.profile.avatar || ''
        });
      }
    }
    load();
  }, [getMyProfile]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      hourlyRate: Number(form.hourlyRate)
    };
    const res = await saveMyProfile(payload);
    setLoading(false);
    if (res.ok) {
      setProfile(res.profile);
      setEdit(false);
    } else {
      alert(res.message || 'Failed to update profile');
    }
  };

  if (!user || user.role !== 'freelancer') {
    return <div className="max-w-xl mx-auto mt-10">Only freelancers can view this page.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {!edit ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img src={profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" className="h-20 w-20 rounded-full border" />
                <div>
                  <div className="font-bold text-xl">{user.name}</div>
                  <div className="text-muted-foreground">{user.email}</div>
                </div>
              </div>
              <div>
                <span className="font-semibold">Title:</span> {profile?.title || 'N/A'}
              </div>
              <div>
                <span className="font-semibold">Bio:</span> {profile?.bio || 'N/A'}
              </div>
              <div>
                <span className="font-semibold">Skills:</span> {(profile?.skills || []).map((s, i) => <Badge key={i} className="mr-1">{s}</Badge>)}
              </div>
              <div>
                <span className="font-semibold">Hourly Rate:</span> {profile?.hourlyRate ? `$${profile.hourlyRate}/hr` : 'N/A'}
              </div>
              <div>
                <span className="font-semibold">Location:</span> {profile?.location || 'N/A'}
              </div>
              <Button onClick={() => setEdit(true)} className="mt-4">Edit Profile</Button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSave}>
              <div>
                <label className="block font-semibold">Title</label>
                <Input name="title" value={form.title} onChange={handleChange} />
              </div>
              <div>
                <label className="block font-semibold">Bio</label>
                <Textarea name="bio" value={form.bio} onChange={handleChange} />
              </div>
              <div>
                <label className="block font-semibold">Skills (comma separated)</label>
                <Input name="skills" value={form.skills} onChange={handleChange} />
              </div>
              <div>
                <label className="block font-semibold">Hourly Rate</label>
                <Input name="hourlyRate" type="number" value={form.hourlyRate} onChange={handleChange} />
              </div>
              <div>
                <label className="block font-semibold">Location</label>
                <Input name="location" value={form.location} onChange={handleChange} />
              </div>
              <div>
                <label className="block font-semibold">Avatar URL</label>
                <Input name="avatar" value={form.avatar} onChange={handleChange} />
              </div>
              <div className="flex gap-2 mt-4">
                <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
                <Button type="button" variant="secondary" onClick={() => setEdit(false)}>Cancel</Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
