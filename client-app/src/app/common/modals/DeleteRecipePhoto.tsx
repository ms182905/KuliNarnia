import { Button, Header, Table } from 'semantic-ui-react';
import { useStore } from '../../stores/store';

interface Props {
    photoId: string;
    setPhotoId: (photoId: string) => void;
}

export default function DeleteRecipePhoto({ photoId, setPhotoId }: Props) {
    const { modalStore, recipeStore } = useStore();
    const { deletePhoto } = recipeStore;

    function deletePhotoAndClose() {
        modalStore.closeModal();
        setPhotoId(photoId);
        deletePhoto(photoId);
    }

    return (
        <>
            <Header textAlign="center" style={{ fontFamily: 'Andale Mono, monospace' }}>
                Usunąć to zdjęcie?
            </Header>
            <Table style={{ border: 'none' }}>
                <tbody>
                    <Table.Row>
                        <Table.Cell textAlign="center" width={6}>
                            <Button fluid className="positiveButton" onClick={() => deletePhotoAndClose()}>
                                Tak
                            </Button>
                        </Table.Cell>
                        <Table.Cell width={1}></Table.Cell>
                        <Table.Cell textAlign="center" width={6}>
                            <Button fluid className="negativeButton" onClick={() => modalStore.closeModal()}>
                                Nie
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                </tbody>
            </Table>
        </>
    );
}
