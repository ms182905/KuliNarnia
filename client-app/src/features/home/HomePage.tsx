import { Link } from "react-router-dom";
import { Container, Header, Segment, Image, Button } from "semantic-ui-react";

export default function HomePage() {
    return (
        <Segment inverted textAlign='center' vertical className='masthead'>
            <Container text>
                <Header as='h1' inverted>
                    <Image size='massive' src='/assets/logo.png' alt='logo' style={{marginBottom: 13}} />
                    KuliNarnia
                </Header>

                <Header as='h2' inverted content='Welcome to KuliNarnia' >
                </Header>
                <Header as='h2'>
                    <Button as={Link} to='/recipes' size='huge' inverted>
                        Take me to recipes!        
                    </Button>
                </Header>
                <Header as='h2'>
                    <Button as={Link} to='/login' size='huge' inverted>
                        Login        
                    </Button>
                </Header>
            </Container>
        </Segment>
    )
}