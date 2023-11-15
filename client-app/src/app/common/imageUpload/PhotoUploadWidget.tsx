import React, { useEffect, useState } from 'react';
import { Button, Grid, Header } from 'semantic-ui-react';
import PhotoWidgetDropzone from './PhotoWidgetDropzone';
import PhotoWidgetCropper from './PhotoWidgetCropper';

interface Props {
    loading: boolean;
    uploadPhoto: (file: Blob) => void;
    ratio: number;
}

export default function PhotoUploadWidget({ loading, uploadPhoto, ratio }: Props) {
    const [files, setFiles] = useState<any>([]);
    const [cropper, setCropper] = useState<Cropper>();
    const [cropperVisible, setCropperVisible] = useState(false);

    function OnCrop() {
        if (cropper) {
            cropper.getCroppedCanvas().toBlob((blob) => uploadPhoto(blob!));
        }
    }

    useEffect(() => {
        return () => {
            files.forEach((file: any) => URL.revokeObjectURL(file.preview));
        };
    }, [files]);

    useEffect(() => {
        if (files.length > 0) setCropperVisible(true);
    }, [files.length]);

    return (
        <Grid>
            <Grid.Column width={4}>
                <Header sub color="teal" content="Step 1 - Add photo" />
                <PhotoWidgetDropzone setFiles={setFiles} />
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header sub color="teal" content="Step 2 - Resize image" />
                {(cropperVisible)? (<PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0]?.preview} ratio={ratio} />) : (<></>)}
                
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header sub color="teal" content="Step 3 - Preview and upload" />
                {files && files.length > 0 && (
                    <>
                        <div className="img-preview" style={{ minHeight: 200, overflow: 'hidden' }} />
                        <Button.Group widths={2}>
                            <Button loading={loading} onClick={OnCrop} positive icon="check" />
                            <Button disabled={loading} onClick={() => {setFiles([]); setCropperVisible(false);}} icon="close" />
                        </Button.Group>
                    </>
                )}
            </Grid.Column>
        </Grid>
    );
}
