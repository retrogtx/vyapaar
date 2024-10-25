import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  content?: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  content,
}) => (
  <div style={{
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
  }}>
    <h1 style={{ color: '#333' }}>Hello, {firstName}!</h1>
    {content && (
      <div style={{ 
        marginTop: '20px',
        lineHeight: '1.6',
        color: '#444',
      }}>
        {content}
      </div>
    )}
    <div style={{
      marginTop: '30px',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '5px',
      textAlign: 'center' as const,
    }}>
      <p style={{ margin: '0', color: '#666' }}>
        Thank you for being our valued customer!
      </p>
    </div>
  </div>
);
