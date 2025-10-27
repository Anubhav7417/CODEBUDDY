import './globals.css';
import { AuthProvider } from '../context';
import { Navbar } from '../components/UI';

export const metadata = {
  title: 'CollabSync - Find Your Code Buddies',
  description: 'Connect with students for amazing projects',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
