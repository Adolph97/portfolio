import React from 'react';
import { motion } from 'framer-motion';
import AdirePattern from '../UI/AdirePattern';

const ease = [0.16, 1, 0.3, 1] as const;

const headline = ['We build the software', 'growing businesses run on.'];

const Hero: React.FC = () => {
  return (
    <section id="top" className="relative pt-10 pb-20 md:pt-16 md:pb-28 lg:pt-20 lg:pb-32">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-16">
        <h1 className="t-display lg:col-span-12 max-w-[14ch] lg:max-w-none">
            {headline.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block"
                  initial={{ y: '105%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.1 + i * 0.1, ease }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
        </h1>

        <div className="lg:col-span-6 lg:self-center">
          <motion.p
            className="t-lead"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.55 }}
          >
            Kona Tech is a studio in Lagos. We design and build web apps, automations and AI tools for teams
            in Nigeria, the UK, the US and further afield.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.65 }}
          >
            <a href="#work" className="btn btn-primary">See our work</a>
            <a
              href="https://calendly.com/obinna-ihekona/zoom"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              Book a discovery call
            </a>
          </motion.div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <figure className="m-0 relative mx-auto max-w-[460px] lg:max-w-none">
            <motion.div
              className="adire relative aspect-[5/6] rounded-[28px] overflow-hidden"
              initial={{ clipPath: 'inset(0 0 100% 0 round 28px)' }}
              animate={{ clipPath: 'inset(0 0 0% 0 round 28px)' }}
              transition={{ duration: 1.1, delay: 0.2, ease }}
            >
              <AdirePattern className="absolute inset-0" />
              <motion.img
                src="/images/hero-image.jpg"
                alt="Obinna Ihekona, founder of Kona Tech"
                className="absolute left-[14%] top-[12%] w-[62%] aspect-[3/4] object-cover rounded-[18px] shadow-[0_24px_60px_-20px_rgba(8,12,40,0.7)]"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.75, ease }}
              />
            </motion.div>
            <figcaption className="mt-4 flex items-baseline justify-between gap-4">
              <span className="font-bold">Obinna Ihekona</span>
              <span className="t-small">Founder, lead systems architect</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
};

export default Hero;
