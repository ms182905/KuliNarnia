import React from 'react';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';

interface Props {
    imagePreview: string;
    setCropper: (cropper: Cropper) => void;
    ratio: number;
}

export default function PhotoWidgetCropper({ imagePreview, setCropper, ratio }: Props) {
    return (
        <Cropper
            src={imagePreview}
            style={{ height: 200, width: '100%' }}
            initialAspectRatio={ratio}
            aspectRatio={ratio}
            preview=".img-preview"
            guides={false}
            viewMode={1}
            autoCropArea={1}
            background={false}
            onInitialized={(cropper) => setCropper(cropper)}
        />
    );
}
