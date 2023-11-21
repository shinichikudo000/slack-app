import { Button } from '@/components/ui/button';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const SignOut = () => {
  const navigate = useNavigate()

  const handleLogOut = () => {
    // Clear user information from localStorage
    localStorage.setItem('access-token', '')
    localStorage.setItem('uid', '')
    localStorage.setItem('expiry', '')
    localStorage.setItem('client', '')

    toast({
      title: 'Thank you for using!',
      description: 'You are now signed out.',
    });

    // Redirect to the sign-in page
    navigate('/sign-in')
  };

  return (
    <Button onClick={handleLogOut}>
      Log Out
    </Button>
  );
};

export default SignOut;