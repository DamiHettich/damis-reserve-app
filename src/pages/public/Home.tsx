import { useTranslation } from 'react-i18next';
import FAQ from '../../components/home/FAQ';
import { Link } from 'react-router-dom';
import { Zap, Users, Briefcase, ArrowRight } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation('home');

  const services = [
    {
      id: 'coaching',
      icon: <Zap className="w-8 h-8 text-primary mb-4" />,
      title: t('services.coaching.title'),
      description: t('services.coaching.description'),
    },
    {
      id: 'codeReview',
      icon: <Users className="w-8 h-8 text-primary mb-4" />,
      title: t('services.codeReview.title'),
      description: t('services.codeReview.description'),
    },
    {
      id: 'career',
      icon: <Briefcase className="w-8 h-8 text-primary mb-4" />,
      title: t('services.career.title'),
      description: t('services.career.description'),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-28 lg:py-32 text-center bg-gradient-to-br from-primary/5 via-transparent to-primary/10 dark:from-primary/10 dark:via-background dark:to-primary/20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in-up">
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up [animation-delay:200ms]">
            {t('hero.subtitle')}
          </p>
          <Link
            to="/calendar"
            className="btn-primary animate-fade-in-up [animation-delay:400ms] inline-flex items-center px-6 py-3 text-lg font-medium rounded-md"
          >
            {t('hero.bookButton')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="section py-16 md:py-20 lg:py-24 bg-background-alt dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <span className="text-sm text-primary font-medium uppercase tracking-wider">
              {t('services.eyebrow')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
              {t('services.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('services.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                className="bg-card dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center animate-fade-in"
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                {service.icon}
                <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground dark:text-gray-300 text-sm">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-faq bg-white dark:bg-background">
        <FAQ />
      </section>
    </div>
  );
}
