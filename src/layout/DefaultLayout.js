import AppSidebar from '../components/AppSidebar';
import AppHeader from '../components/AppHeader';

const DefaultLayout = ({ children }) => {
  return (
    <div className="d-flex bg-body" style={{ minHeight: '100vh' }}>
      <AppSidebar />

      <div className="flex-grow-1 d-flex flex-column">
        <AppHeader />

        <main className="p-4 flex-grow-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DefaultLayout;