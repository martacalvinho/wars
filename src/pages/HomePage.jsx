import Hero from '../components/Hero';
import styled from 'styled-components';
import NextBattles from '../components/home/NextBattles';

const Container = styled.div`
  padding: 2rem;
  margin-top: 60px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

const NextBattlesSection = styled.section`
  margin-top: 3rem;
  padding-top: 2rem;
`;

const HomePage = () => {
  return (
    <main>
      <Hero />
      <Container>
        <NextBattlesSection>
          <NextBattles />
        </NextBattlesSection>
      </Container>
    </main>
  );
};

export default HomePage;