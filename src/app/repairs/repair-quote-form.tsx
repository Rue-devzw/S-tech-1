'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.413-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.5-5.604-1.438l-6.26-1.673zm6.715-4.82a9.376 9.376 0 005.132 1.431c5.176.001 9.38-4.203 9.382-9.379.002-5.176-4.204-9.38-9.38-9.38-5.175 0-9.378 4.204-9.38 9.38 0 2.021.653 3.934 1.838 5.542l-1.155 4.226 4.354-1.156zM13.255 12.427l-.462-.233c-.958-.484-1.564-.73-1.564-1.565 0-.835.63-1.428 1.383-1.428.106 0 .21.01.312.031.543.111 1.225.594 1.336 1.562l.062.533-.462.232c-.958.484-1.565.73-1.565 1.565 0 .835.63 1.428 1.384 1.428.105 0 .21-.01.31-.031.543-.111 1.225-.594 1.337-1.562l.062-.533z"/>
    </svg>
);


export default function RepairQuoteForm() {
    const [device, setDevice] = useState('');
    const [issue, setIssue] = useState('');
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const phoneNumber = '263718704505';
      const message = `Hello, I would like a repair quote.\n\n*Device:* ${device}\n*Issue:* ${issue}`;
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      
      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');
    };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="device">Device Type</Label>
          <Input 
            id="device" 
            name="device" 
            placeholder="e.g., iPhone 13, Samsung Galaxy S21" 
            required 
            value={device}
            onChange={(e) => setDevice(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="issue">Describe the Issue</Label>
          <Textarea 
            id="issue" 
            name="issue" 
            placeholder="e.g., Cracked screen, battery not charging" 
            required 
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            />
        </div>
        <Button type="submit" className="w-full">
            <WhatsAppIcon className="mr-2 h-4 w-4" /> Send Quote via WhatsApp
        </Button>
      </form>
    </div>
  );
}
