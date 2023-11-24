import React, { useEffect, useState } from 'react';
import { Button, Header } from 'semantic-ui-react';
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
        <>
            <Header sub content="Step 1 - Add photo" style={{ fontFamily: 'Andale Mono, monospace' }} />
            <PhotoWidgetDropzone setFiles={setFiles} />

            {cropperVisible ? (
                <>
                    <Header sub content="Step 2 - Resize image" style={{ fontFamily: 'Andale Mono, monospace' }} />
                    <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0]?.preview} ratio={ratio} />
                    <Header
                        sub
                        content="Step 3 - Preview and upload"
                        style={{ fontFamily: 'Andale Mono, monospace' }}
                    />
                    {files && files.length > 0 && (
                        <>
                            <div
                                className="img-preview"
                                style={{
                                    height: '18em',
                                    width: '100%',
                                    overflow: 'hidden',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    marginBottom: '1em',
                                }}
                            />
                            <Button
                                loading={loading}
                                onClick={OnCrop}
                                positive
                                icon="check"
                                content="Apply"
                                className="positiveButton"
                                style={{ width: '40%', marginRight: 'auto', marginLeft: 'auto' }}
                            />
                            <Button
                                disabled={loading}
                                onClick={() => {
                                    setFiles([]);
                                    setCropperVisible(false);
                                }}
                                className="negativeButton"
                                icon="close"
                                content="Reset"
                                style={{ width: '40%', marginRight: 'auto', marginLeft: 'auto' }}
                            />
                        </>
                    )}
                </>
            ) : (
                <></>
            )}
        </>
    );
}
