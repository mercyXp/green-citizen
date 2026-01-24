import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>;
  Body: React.FC<CardBodyProps>;
  Footer: React.FC<CardFooterProps>;
  Content: React.FC<CardContentProps>;
} = ({ 
  children, 
  className = '', 
  hoverable = false,
  onClick 
}) => {
  return (
    <div 
      className={`card ${hoverable ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({ 
  children, 
  className = '',
  title,
  subtitle
}) => (
  <div className={`mb-4 pb-4 border-b border-border-primary ${className}`}>
    {title && <h3 className="text-lg font-semibold text-primary mb-1">{title}</h3>}
    {subtitle && <p className="text-sm text-secondary">{subtitle}</p>}
    {children}
  </div>
);

const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    {children}
  </div>
);

const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => (
  <div className={`text-secondary ${className}`}>
    {children}
  </div>
);

const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => (
  <div className={`mt-6 pt-4 border-t border-border-primary flex items-center gap-3 ${className}`}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;