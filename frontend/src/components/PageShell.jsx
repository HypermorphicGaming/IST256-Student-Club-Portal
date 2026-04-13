import Footer from './Footer';

function PageShell({ children }) {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <div className="page-shell__content flex-grow-1">
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default PageShell;