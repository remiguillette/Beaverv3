import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface DashboardPanelProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkTo: string;
  buttonText: string;
}

const DashboardPanel: React.FC<DashboardPanelProps> = ({
  title,
  description,
  icon,
  linkTo,
  buttonText
}) => {
  return (
    <Card className="bg-card border border-border hover:shadow-lg transition-transform hover:scale-105">
      <CardContent className="p-5">
        <div className="flex items-center justify-center h-16 mb-4 text-primary">
          {icon}
        </div>
        <h2 className="text-xl font-semibold text-white text-center mb-1">{title}</h2>
        <p className="text-muted-foreground text-center text-sm mb-4">{description}</p>
        <div className="flex justify-center">
          <Link to={linkTo} className="flex items-center justify-center px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors text-sm">
            <ArrowRight className="h-4 w-4 mr-1" />
            {buttonText}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardPanel;
