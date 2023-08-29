import { Link } from "react-router-dom";
import { Container, Header, Segment, Image, Button } from "semantic-ui-react";

export default function HomePage() {
    return (
        <Segment inverted textAlign='center' vertical className='masthead'>
            <Container text>
                <Header as='h1' inverted>
                    <Image size='massive' src='/assets/logo.png' alt='logo' style={{marginBottom: 12}} />
                    KuliNarnia
                </Header>
                <Header as='h2' inverted content='Welcome to KuliNarnia'>
                <Button as={Link} to='/recipes' size='huge' inverted>
                    Take me to recipes!        
                </Button>        
                </Header>
            </Container>
        </Segment>
    )
}