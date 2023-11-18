import { observer } from 'mobx-react-lite';
import { Header, Item, Segment } from 'semantic-ui-react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import { Recipe } from '../../../../../app/models/recipe';
import { useStore } from '../../../../../app/stores/store';

const recipeImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white',
};

interface Props {
    recipe: Recipe;
}

export default observer(function RecipeDetailedHeader({ recipe }: Props) {
    useStore();

    return (
        <Segment.Group>
            <Segment basic attached="top" style={{ padding: '0' }}>
                <Slide>
                    {recipe.photos?.length ? (
                        recipe.photos.map((photo, index) => (
                            <div key={index} className="each-slide-effect">
                                <div style={{ backgroundImage: `url(${photo.url})` }}></div>
                            </div>
                        ))
                    ) : (
                        <div className="each-slide-effect">
                            <div style={{ backgroundImage: `url('/assets/placeholder.png')` }}>
                                <span>No photos available</span>
                            </div>
                        </div>
                    )}
                </Slide>
                {/* <Image src="/assets/placeholder.png" fluid style={recipeImageStyle} /> */}
                <Segment style={recipeImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header size="huge" content={recipe.title} style={{ color: 'white' }} />
                                <p>{recipe.date}</p>
                                <p>
                                    Created by <strong>{recipe.creatorName}</strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
        </Segment.Group>
    );
});
