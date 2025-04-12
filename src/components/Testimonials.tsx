import React from 'react';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Suhaina G',
    role: 'Computer Science Student',
    image: 'src/components/suhaina_img.jpg',
    content: 'testimonials.suhaina',
  },
  {
    id: 2,
    name: 'Nithin N Patel',
    role: 'Engineering Student',
    image: 'src/components/nithin_img.jpg',
    content: 'testimonials.nithin',
  },
  {
    id: 3,
    name: 'Prakul H N',
    role: 'Medical Student',
    image: 'src/components/prakul_img.jpg',
    content: 'testimonials.prakul',
  },
  {
    id: 4,
    name: 'Mohammed Nishad P A',
    role: 'Data Science Student',
    image: 'src/components/nishad_img.jpg',
    content: 'testimonials.nishad',
  },
];

export default function Testimonials() {
  const { t } = useTranslation();

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {t('testimonials.title')}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {t('testimonials.subtitle')}
          </p>
        </div>
        <div className="mt-16 grid gap-8 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="relative p-6 bg-white rounded-2xl shadow-xl transform transition-all duration-300 hover:-translate-y-2"
            >
              <div className="absolute -top-4 right-4 flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                  <p className="text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="mt-6 text-gray-600 italic">"{t(testimonial.content)}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}