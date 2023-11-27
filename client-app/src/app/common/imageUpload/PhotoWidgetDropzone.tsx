import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Header, Icon } from 'semantic-ui-react';

interface Props {
    setFiles: (files: any) => void;
}

export default function PhotoWidgetDropzone({ setFiles }: Props) {
    const dzStyles = {
        border: 'dashed 3px #eee',
        borderColor: '#eee',
        borderRadius: '5px',
        paddingTop: '30px',
        textAlign: 'center' as 'center',
        width: '100%',
    };

    const dzActive = {
        borderColor: 'green',
    };

    const onDrop = useCallback(
        (acceptedFiles: object[]) => {
            setFiles(
                acceptedFiles.map((file: any) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                )
            );
        },
        [setFiles]
    );
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()} style={isDragActive ? { ...dzStyles, ...dzActive } : dzStyles}>
            <input {...getInputProps()} />
            <Icon name="upload" size="huge" style={{ marginLeft: 'auto', marginRight: 'auto' }} />
            <Header
                content="Upuść zdjęcie tutaj lub kliknij, aby wybrać plik"
                style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginBottom: '1em',
                    fontFamily: 'Andale Mono, monospace',
                }}
            />
        </div>
    );
}
