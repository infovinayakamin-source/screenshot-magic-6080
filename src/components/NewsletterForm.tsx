import { useId, useState } from 'react';
import { z } from 'zod';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
export function NewsletterForm() {
  const id = useId();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  return <form className="newsletter-form" noValidate onSubmit={(event) => { event.preventDefault(); const result = z.string().trim().email().max(254).safeParse(email); setMessage(result.success ? 'Subscriptions are not connected yet. Please visit Contact for enquiries.' : 'Please enter a valid email address.'); }}>
    <label htmlFor={id} className="sr-only">Email address</label>
    <div className="newsletter-input"><Input id={id} type="email" autoComplete="email" maxLength={254} placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} aria-describedby={`${id}-message`} /><Button type="submit" variant="sunrise" aria-label="Subscribe to newsletter"><ArrowRight /></Button></div>
    <p id={`${id}-message`} role="status">{message || 'News and new arrivals. Subscription service coming soon.'}</p>
  </form>;
}
