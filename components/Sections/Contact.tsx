import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DotGrid from '../UI/DotGrid';
import { BRAND } from '../../lib/brand';
import { KonaMark } from '../Brand/KonaLogo';
import { RevealHeading } from '../UI/Reveal';

const EMAIL = 'hello@konatechlimited.org';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get('content-type');
      const data = contentType?.includes('application/json') ? await response.json() : undefined;

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(response.status === 400 ? 'Please fill in every field.' : 'Something went wrong on our side.');
        console.error('Server Error:', data || response.statusText);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
      setErrorMessage('Check your connection and try again.');
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="section">
      <div className="wrap">
        <div className="contact-band stage">
          <div className="contact-grid" aria-hidden="true">
            <DotGrid pitch={24} radius={1.2} />
          </div>
          <KonaMark variant="glyph" size={420} className="contact-watermark" />
          <div className="relative grid gap-12 lg:grid-cols-2 lg:gap-16 px-7 pb-9 pt-[112px] sm:px-10 sm:pb-12 lg:px-16 lg:pb-16 lg:pt-[128px]">
            <div>
              <RevealHeading id="contact-title" className="t-h2 text-white">Tell us what you're building</RevealHeading>
              <p className="mt-5 text-[1.125rem] leading-relaxed max-w-[30em] text-[var(--on-indigo)] opacity-90">
                Send a few lines about the problem you want solved. We'll reply with questions, a rough approach,
                or an honest note if we're not the right fit.
              </p>

              <dl className="mt-10 grid gap-6">
                <div>
                  <dt className="text-[0.875rem] opacity-75">Email</dt>
                  <dd className="m-0 mt-1">
                    <a href={`mailto:${EMAIL}`} className="text-[1.25rem] md:text-[1.5rem] font-bold text-white underline underline-offset-4 decoration-1 decoration-white/40 hover:decoration-white break-all">
                      {EMAIL}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.875rem] opacity-75">Prefer to talk?</dt>
                  <dd className="m-0 mt-3">
                    <a
                      href="https://calendly.com/obinna-ihekona/zoom"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-light"
                    >
                      Book a discovery call
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 content-start">
              <div className="field">
                <label htmlFor="contact-name">Your name</label>
                <input id="contact-name" type="text" name="name" autoComplete="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="field">
                <label htmlFor="contact-email">Email</label>
                <input id="contact-email" type="email" name="email" autoComplete="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="field">
                <label htmlFor="contact-message">What do you need help with?</label>
                <textarea
                  id="contact-message"
                  rows={5}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="For example: our sales team tracks leads in WhatsApp and a spreadsheet, and things fall through the cracks."
                  className="resize-y"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-1">
                <button type="submit" disabled={status === 'sending'} className="btn btn-on-indigo">
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                </button>
              </div>

              <div aria-live="polite">
                {status === 'success' && (
                  <motion.p
                    className="form-note m-0 flex items-center gap-3"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true" className="shrink-0">
                      <motion.circle
                        cx="14" cy="14" r="12" stroke={BRAND.ochreOnDark} strokeWidth="2"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }}
                      />
                      <motion.path
                        d="M8.5 14.5l3.5 3.5 7.5-8" stroke={BRAND.ochreOnDark} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.5 }}
                      />
                    </svg>
                    Message sent. We'll get back to you soon.
                  </motion.p>
                )}
                {status === 'error' && (
                  <p className="form-note m-0">
                    Your message wasn't sent. {errorMessage} You can also email{' '}
                    <a href={`mailto:${EMAIL}`} className="underline">{EMAIL}</a> directly.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
