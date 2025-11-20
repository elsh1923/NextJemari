"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import getCroppedImg from "@/lib/cropImage";
import { Loader2 } from "lucide-react";

interface ImageCropperProps {
    imageSrc: string;
    onCropComplete: (croppedImage: Blob) => void;
    onCancel: () => void;
    open: boolean;
}

export function ImageCropper({ imageSrc, onCropComplete, onCancel, open }: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropCompleteCallback = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        if (!croppedAreaPixels) return;
        setLoading(true);
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            if (croppedImage) {
                onCropComplete(croppedImage);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Crop Image</DialogTitle>
                </DialogHeader>
                <div className="relative h-64 w-full bg-slate-900">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteCallback}
                        onZoomChange={onZoomChange}
                    />
                </div>
                <div className="py-4">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Zoom
                    </label>
                    <Slider
                        value={[zoom]}
                        min={1}
                        max={3}
                        step={0.1}
                        onValueChange={(value) => setZoom(value[0])}
                        className="mt-2"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onCancel} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
