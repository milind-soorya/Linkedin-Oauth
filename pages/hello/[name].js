import styles from '../../styles/Home.module.css';
import { useRouter } from 'next/router';

const Index = () => {
  const router = useRouter();
  const { name, email, picture } = router.query;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Hello {name}</h1>

        {email && (
          <p>
            Email: <strong>{email}</strong>
          </p>
        )}

        {picture && (
          <img src={picture} alt="User profile" className={styles.profileImage} />
        )}
        
        {/* Add more components for other parameters as needed */}
      </main>
    </div>
  );
};

export default Index;
