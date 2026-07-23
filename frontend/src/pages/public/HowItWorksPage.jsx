import React from 'react';
import { UserPlus, FileEdit, Activity, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorksPage = () => {
  const steps = [
    {
      id: 1,
      title: 'Create an Account',
      description: 'Register securely on the JanKalyan platform using your email or phone number. A secure account ensures your data and complaints remain private.',
      icon: UserPlus,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
    },
    {
      id: 2,
      title: 'Submit your Grievance',
      description: 'Fill out a simple form detailing your issue. You can select categories, provide a detailed description, and even attach photos as proof.',
      icon: FileEdit,
      color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400',
    },
    {
      id: 3,
      title: 'Track in Real-Time',
      description: 'Monitor the exact status of your complaint directly from your personalized dashboard. Get instant notifications whenever there is an update.',
      icon: Activity,
      color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400',
    },
    {
      id: 4,
      title: 'Quick Resolution',
      description: 'Dedicated authorities review your grievance and take necessary actions. Once resolved, you will be notified and can provide feedback.',
      icon: CheckCircle,
      color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background pt-24 pb-12 sm:pt-32 sm:pb-16">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-primary/20 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
            How to use <span className="text-primary">JanKalyan</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Your voice matters. Learn how to report issues in your community and get them resolved quickly through our transparent and secure platform.
          </p>
        </div>
      </div>

      {/* Steps Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <step.icon className="w-32 h-32" />
                </div>
                <dt className="flex items-center gap-x-4 text-xl font-semibold leading-7 text-foreground">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${step.color}`}>
                    <step.icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                  Step {step.id}: {step.title}
                </dt>
                <dd className="mt-6 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto relative z-10">{step.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center bg-primary/5 rounded-3xl p-10 border border-primary/10">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-6">
            Ready to make a difference?
          </h2>
          <p className="text-lg leading-8 text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of citizens who are actively contributing to a better society. Report your first issue today.
          </p>
          <div className="flex items-center justify-center gap-x-6">
            <Link
              to="/register"
              className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2"
            >
              Get Started Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/complaints" className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors">
              View Public Board <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
