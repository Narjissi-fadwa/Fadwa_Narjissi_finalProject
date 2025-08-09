import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, Calendar, DollarSign, MapPin, Home, Eye, X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from '@/components/input-error';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
const breadcrumbs = [
    {
        title: 'Owner Dashboard',
        href: '/owner/dashboard',
    },
];

const Dashboard = () => {
    const { auth, properties = [], upcomingVisits = [] } = usePage().props;

    const [showAddModal, setShowAddModal] = useState(false);
    const [isUpdateOpened, setIsUpdateOpened] = useState(false);
    const [isDeleteOpened, setIsDeleteOpened] = useState(false);

    const [selectedProperty, setSelectedProperty] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    const { data, setData, processing, errors, reset, delete: destroy } = useForm({
        title: '',
        address: '',
        type: 'apartment',
        property_subtype: '',
        area: '',
        description: '',
        price: '',
        listing_type: 'sale',
        bedrooms: '',
        floors: '',
        images: [],
    });

    const submitProperty = () => {
        if (!data.title || !data.address || !data.description || !data.price || !data.area) {
            setErrorMessage('Please fill in all required fields');
            setTimeout(() => setErrorMessage(null), 3000);
            return;
        }

        if (selectedImages.length === 0) {
            setErrorMessage('Please upload at least one image');
            setTimeout(() => setErrorMessage(null), 3000);
            return;
        }

        const formData = new FormData();

        Object.keys(data).forEach(key => {
            if (key !== 'images') {
                const value = data[key] ?? '';
                formData.append(key, value);
            }
        });

        selectedImages.forEach((file, index) => {
            formData.append(`images[${index}]`, file);
        });

        router.post('/properties/store', formData, {
            onError: (errors) => {
                if (errors && typeof errors === 'object') {
                    const errorMessages = Object.entries(errors)
                        .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                        .join('\n');
                    setErrorMessage(`Validation errors:\n${errorMessages}`);
                } else {
                    setErrorMessage('Failed to create property. Please check all fields and try again.');
                }
                setTimeout(() => setErrorMessage(null), 8000);
            },
            onSuccess: () => {
                setShowAddModal(false);
                setSelectedImages([]);
                setImagePreviewUrls([]);
                reset();
                setErrorMessage(null);
                window.location.reload();
            }
        });
    };

    const updateProperty = () => {
        if (!data.title || !data.address || !data.description || !data.price || !data.area) {
            setErrorMessage('Please fill in all required fields');
            setTimeout(() => setErrorMessage(null), 3000);
            return;
        }

        const updateData = {
            title: data.title,
            address: data.address,
            type: data.type,
            property_subtype: data.property_subtype || '',
            area: data.area,
            description: data.description,
            price: data.price,
            listing_type: data.listing_type,
            bedrooms: data.bedrooms || '',
            floors: data.floors || '',
        };

        if (data.existing_images?.length > 0) {
            updateData.existing_images = data.existing_images;
        }

        const formData = new FormData();
        formData.append('_method', 'PUT');

        Object.keys(updateData).forEach(key => {
            if (key !== 'existing_images') {
                const value = updateData[key] ?? '';
                formData.append(key, value);
            }
        });

        if (data.existing_images?.length > 0) {
            data.existing_images.forEach((imageUrl, index) => {
                formData.append(`existing_images[${index}]`, imageUrl);
            });
        }

        selectedImages.forEach((file, index) => {
            formData.append(`images[${index}]`, file);
        });

        router.post(`/properties/${selectedProperty.id}`, formData, {
            onError: (errors) => {
                if (errors && typeof errors === 'object') {
                    const errorMessages = Object.entries(errors)
                        .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                        .join('\n');
                    setErrorMessage(`Validation errors:\n${errorMessages}`);
                } else {
                    setErrorMessage('Failed to update property. Please check all fields and try again.');
                }
                setTimeout(() => setErrorMessage(null), 8000);
            },
            onSuccess: () => {
                setIsUpdateOpened(false);
                setSelectedProperty(null);
                setSelectedImages([]);
                setImagePreviewUrls([]);
                setExistingImages([]);
                reset();
                setErrorMessage(null);
            }
        });
    };

    const deleteProperty = () => {
        destroy(`/properties/${selectedProperty?.id}`, {
            onFinish: () => {
                setIsDeleteOpened(false);
                setSelectedProperty(null);
            }
        });
    };

    const handleEdit = (property) => {
        setSelectedProperty(property);
        setData({
            title: property.title,
            address: property.address,
            type: property.type,
            property_subtype: property.property_subtype || '',
            area: property.area,
            description: property.description,
            price: property.price,
            listing_type: property.listing_type,
            bedrooms: property.bedrooms || '',
            floors: property.floors || '',
            existing_images: property.images || [],
        });

        setExistingImages(property.images || []);
        setSelectedImages([]);
        setImagePreviewUrls([]);
        setErrorMessage(null);
        setIsUpdateOpened(true);
    };

    const handleDelete = (property) => {
        setIsDeleteOpened(true);
        setSelectedProperty(property);
    };

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        const totalImages = existingImages.length + selectedImages.length + files.length;

        if (totalImages > 5) {
            alert(`You can have maximum 5 images total. Currently you have ${existingImages.length + selectedImages.length} images.`);
            return;
        }

        const processedFiles = [];
        const previewUrls = [];

        for (const file of files) {
            if (file.size > 2 * 1024 * 1024) {
                alert(`File ${file.name} is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Please choose images smaller than 2MB.`);
                continue;
            }

            processedFiles.push(file);
            previewUrls.push(URL.createObjectURL(file));
        }

        if (processedFiles.length === 0) {
            alert('No valid images selected. Please choose images smaller than 2MB.');
            return;
        }

        setSelectedImages([...selectedImages, ...processedFiles]);
        setImagePreviewUrls([...imagePreviewUrls, ...previewUrls]);
    };

    const removeNewImage = (index) => {
        setSelectedImages(selectedImages.filter((_, i) => i !== index));
        setImagePreviewUrls(imagePreviewUrls.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index) => {
        setExistingImages(existingImages.filter((_, i) => i !== index));
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs} >
            <Head title="Owner Dashboard"  />

            <div className="min-h-screen bg-fixed bg-[url('/storage/real-estatebg.png')] bg-contain bg-no-repeat  bg-right relative p-0 m-0'">
                <div className="absolute inset-0 bg-slate-900/30"></div>
                <div className="relative z-10 w-full min-h-screen overflow-y-auto">
                    <div className="p-6 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Welcome back, {auth?.user?.name || 'User'}</h1>
                        <p className="text-slate-900/80 text-lg">Manage your properties, track visits, and handle offers</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-6">
                        <div className="backdrop-blur-md bg-black/5 border border-black/10 rounded-3xl shadow-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-slate-">My Listings</h3>
                                <Home className="w-8 h-8 text-[#2F8663]" />
                            </div>
                            <div className="text-3xl font-bold text-slate- mb-2">{properties?.length || 0}</div>
                            <div className="text-slate-/70 text-sm space-y-1">
                                <div>✅ {properties?.filter(p => p.payment_status === 'paid')?.length || 0} active listings</div>
                                <div>⏳ {properties?.filter(p => p.approval_status === 'pending')?.length || 0} pending approval</div>
                            </div>
                        </div>
                        <div className="backdrop-blur-md bg-black/5 border border-black/10 rounded-3xl shadow-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-slate-">Upcoming Visits</h3>
                                <Calendar className="w-8 h-8 text-[#2F8663]" />
                            </div>
                            <div className="text-3xl font-bold text-slate- mb-2">{upcomingVisits?.length || 0}</div>
                            <div className="text-slate-/70 text-sm">
                                {(upcomingVisits?.length || 0) > 0 ? 'Next visit today' : 'No visits scheduled'}
                            </div>
                        </div>
                        <div className="backdrop-blur-md bg-black/5 border border-black/10 rounded-3xl shadow-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-slate-">Recent Offers</h3>
                                <DollarSign className="w-8 h-8 text-[#2F8663]" />
                            </div>
                            <div className="text-3xl font-bold text-slate- mb-2">
                                {properties?.reduce((total, property) => total + (property.pending_offers?.length || 0), 0) || 0}
                            </div>
                            <div className="text-slate-/70 text-sm">Pending offers</div>
                        </div>
                    </div>
                    <div className="px-6 pb-6 flex justify-center ">
                        <Button
                            onClick={() => {
                                reset();
                                setSelectedImages([]);
                                setImagePreviewUrls([]);
                                setErrorMessage(null);
                                setShowAddModal(true);
                            }}
                            className="px-8 py-3 bg-[#2F8663] hover:bg-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            size="lg"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Property
                        </Button>
                    </div>
                    <div className="px-6 pb-6">
                        <div className="backdrop-blur-md bg-black/5 border border-black/10 rounded-3xl shadow-2xl">
                            <div className="px-6 py-4 border-b border-black/10">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-semibold text-slate-">Your Properties</h2>
                                    
                                </div>
                            </div>
                            <Table className="text-slate-">
                                <TableHeader>
                                    <TableRow className="border-black/5 hover:bg-white/5">
                                        <TableHead className="text-slate-/70 font-medium text-xs uppercase tracking-wider">Property</TableHead>
                                        <TableHead className="text-slate-/70 font-medium text-xs uppercase tracking-wider">Type</TableHead>
                                        <TableHead className="text-slate-/70 font-medium text-xs uppercase tracking-wider">Price</TableHead>
                                        <TableHead className="text-slate-/70 font-medium text-xs uppercase tracking-wider">Visits</TableHead>
                                        <TableHead className="text-slate-/70 font-medium text-xs uppercase tracking-wider">Approval</TableHead>
                                        <TableHead className="text-slate-/70 font-medium text-xs uppercase tracking-wider">Payment</TableHead>
                                        <TableHead className="text-slate-/70 font-medium text-xs uppercase tracking-wider">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {!properties || properties.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-slate-/70">
                                                <Home className="w-12 h-12 mx-auto mb-4 text-slate-/30" />
                                                <p>No properties added yet. Click "Add Property" to get started!</p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        (properties || []).map((property) => (
                                            <TableRow key={property.id} className="border-black/5 hover:bg-white/5 transition-colors duration-200">
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        {property.images && property.images.length > 0 ? (
                                                            <img
                                                                src={property.images[0]}
                                                                alt={property.title}
                                                                className="w-12 h-12 object-cover rounded-lg border border-black/10"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 bg-black/5 rounded-lg border border-black/10 flex items-center justify-center">
                                                                <ImageIcon className="w-6 h-6 text-slate-/40" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="text-sm font-medium text-slate-">{property.title}</div>
                                                            <div className="text-sm text-slate-/70 flex items-center">
                                                                <MapPin className="w-4 h-4 mr-1" />
                                                                {property.address}
                                                            </div>
                                                            {property.images && property.images.length > 1 && (
                                                                <div className="text-xs text-[#2F8663] mt-1">
                                                                    +{property.images.length - 1} more images
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm text-slate- capitalize">{property.type}</div>
                                                    {property.property_subtype && (
                                                        <div className="text-sm text-slate-/70">{property.property_subtype}</div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm font-medium text-slate-">
                                                        ${property.price.toLocaleString()}
                                                    </div>
                                                    <div className="text-sm text-slate-/70 capitalize">{property.listing_type}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center text-sm text-slate-">
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        {property.visits_count}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${property.approval_status === 'approved'
                                                            ? 'bg-black/20 text-emerald-400 border border-emerald-500/30'
                                                            : property.approval_status === 'rejected'
                                                                ? 'bg-black/20 text-red-400 border border-red-500/30'
                                                                : 'bg-black/20 text-yellow-400 border border-yellow-500/30'
                                                        }`}>
                                                        {property.approval_status}
                                                    </span>
                                                    {property.assigned_agent && (
                                                        <div className="text-xs text-slate-/60 mt-1">
                                                            Agent: {property.assigned_agent.name}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${property.payment_status === 'paid'
                                                            ? 'bg-black/20 text-emerald-400 border border-emerald-500/30'
                                                            : 'bg-black/20 text-yellow-400 border border-yellow-500/30'
                                                        }`}>
                                                        {property.payment_status}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        {property.approval_status === 'approved' && property.payment_status === 'pending' && (
                                                            <Button
                                                                onClick={() => window.location.href = `/payment/property/${property.id}`}
                                                                className="bg-emerald-600 hover:bg-emerald-700 text-slate-900 text-xs px-3 py-1"
                                                                size="sm"
                                                            >
                                                                <DollarSign className="w-4 h-4 mr-1" />
                                                                Pay Now
                                                            </Button>
                                                        )}
                                                        <Button
                                                            onClick={() => handleEdit(property)}
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20 bg-black/20"
                                                            title="Edit Property"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleDelete(property)}
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20 bg-black/20"
                                                            title="Delete Property"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={showAddModal} onOpenChange={(open) => {
                if (!open) {
                    setShowAddModal(false);
                    setSelectedImages([]);
                    setImagePreviewUrls([]);
                    setErrorMessage(null);
                    reset();
                }
            }}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                            Add New Property
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">
                            Fill in the details to add a new property to your portfolio.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Title */}
                            <div className="md:col-span-2">
                                <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Property Title *
                                </Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Enter property title"
                                    className="mt-1"
                                />
                                <InputError message={errors.title} />
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="address" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Address *
                                </Label>
                                <Input
                                    id="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Enter property address"
                                    className="mt-1"
                                />
                                <InputError message={errors.address} />
                            </div>
                            <div>
                                <Label htmlFor="listing_type" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Listing Type *
                                </Label>
                                <select
                                    id="listing_type"
                                    value={data.listing_type}
                                    onChange={(e) => setData('listing_type', e.target.value)}
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                >
                                    <option value="sale">For Sale</option>
                                    <option value="rent">For Rent</option>
                                </select>
                                <InputError message={errors.listing_type} />
                            </div>
                            <div>
                                <Label htmlFor="type" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Property Type *
                                </Label>
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                >
                                    <option value="apartment">Apartment</option>
                                    <option value="house">House</option>
                                    <option value="villa">Villa</option>
                                    <option value="land">Land</option>
                                </select>
                                <InputError message={errors.type} />
                            </div>
                            <div>
                                <Label htmlFor="price" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Price ($) *
                                </Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    placeholder="Enter price"
                                    min="0"
                                    className="mt-1"
                                />
                                <InputError message={errors.price} />
                            </div>
                            <div>
                                <Label htmlFor="area" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Area (m²) *
                                </Label>
                                <Input
                                    id="area"
                                    type="number"
                                    value={data.area}
                                    onChange={(e) => setData('area', e.target.value)}
                                    placeholder="Enter area"
                                    min="1"
                                    className="mt-1"
                                />
                                <InputError message={errors.area} />
                            </div>
                            {data.type === 'apartment' && (
                                <div>
                                    <Label htmlFor="bedrooms" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Number of Bedrooms
                                    </Label>
                                    <Input
                                        id="bedrooms"
                                        type="number"
                                        value={data.bedrooms}
                                        onChange={(e) => setData('bedrooms', e.target.value)}
                                        placeholder="Number of bedrooms"
                                        min="1"
                                        className="mt-1"
                                    />
                                    <InputError message={errors.bedrooms} />
                                </div>
                            )}
                            {data.type === 'house' && (
                                <div>
                                    <Label htmlFor="floors" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Floors (e.g., R+1, R+2)
                                    </Label>
                                    <Input
                                        id="floors"
                                        type="text"
                                        value={data.floors}
                                        onChange={(e) => setData('floors', e.target.value)}
                                        placeholder="e.g., R+1, R+2"
                                        className="mt-1"
                                    />
                                    <InputError message={errors.floors} />
                                </div>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Description *
                            </Label>
                            <Input
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Enter property description"
                                className="mt-1"
                            />
                            <InputError message={errors.description} />
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Property Images *
                            </Label>
                            <div className="mt-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="cursor-pointer flex flex-col items-center"
                                >
                                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Click to upload images or drag and drop
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                        PNG, JPG, GIF up to 10MB each
                                    </span>
                                </label>
                            </div>
                            {imagePreviewUrls.length > 0 && (
                                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {imagePreviewUrls.map((url, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={url}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <InputError message={errors.images} />
                        </div>
                    </div>
                    {errorMessage && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-red-600 dark:text-red-400 text-sm">{errorMessage}</p>
                        </div>
                    )}

                    <DialogFooter className="flex justify-end space-x-3">
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            onClick={submitProperty}
                            type="button"
                            disabled={processing}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            {processing ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className='animate-spin w-4 h-4' />
                                    Saving...
                                </div>
                            ) : 'Add Property'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={isUpdateOpened} onOpenChange={(open) => {
                if (!open) {
                    setIsUpdateOpened(false);
                    setSelectedProperty(null);
                    setSelectedImages([]);
                    setImagePreviewUrls([]);
                    setExistingImages([]);
                    setErrorMessage(null);
                    reset();
                }
            }}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                            Update Property
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">
                            Update your property details below.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 ">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <Label htmlFor="update_title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Property Title *
                                </Label>
                                <Input
                                    id="update_title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Enter property title"
                                    className="mt-1"
                                />
                                <InputError message={errors.title} />
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="update_address" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Address *
                                </Label>
                                <Input
                                    id="update_address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Enter property address"
                                    className="mt-1"
                                />
                                <InputError message={errors.address} />
                            </div>
                            <div>
                                <Label htmlFor="update_price" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Price ($) *
                                </Label>
                                <Input
                                    id="update_price"
                                    type="number"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    placeholder="Enter price"
                                    min="0"
                                    className="mt-1"
                                />
                                <InputError message={errors.price} />
                            </div>
                            <div>
                                <Label htmlFor="update_area" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Area (m²) *
                                </Label>
                                <Input
                                    id="update_area"
                                    type="number"
                                    value={data.area}
                                    onChange={(e) => setData('area', e.target.value)}
                                    placeholder="Enter area"
                                    min="1"
                                    className="mt-1"
                                />
                                <InputError message={errors.area} />
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="update_description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Description *
                                </Label>
                                <Input
                                    id="update_description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Enter property description"
                                    className="mt-1"
                                />
                                <InputError message={errors.description} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Property Images
                            </Label>
                            {existingImages.length > 0 && (
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        Current Images ({existingImages.length}):
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {existingImages.map((imageUrl, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={imageUrl}
                                                    alt={`Existing ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div>
                                <input
                                    id="update-image-upload"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="update-image-upload"
                                    className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors"
                                >
                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Add more images (max {5 - existingImages.length - selectedImages.length} more)
                                    </span>
                                </label>
                            </div>
                            {imagePreviewUrls.length > 0 && (
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">New Images:</p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {imagePreviewUrls.map((url, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={url}
                                                    alt={`New ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        {errorMessage && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-red-600 dark:text-red-400 text-sm">{errorMessage}</p>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="sm:justify-end">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button onClick={updateProperty} type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            {processing ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className='animate-spin w-4 h-4' />
                                    Updating...
                                </div>
                            ) : "Update"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={isDeleteOpened} onOpenChange={setIsDeleteOpened}>
                <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Delete Property</DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">
                            Are you sure you want to delete the property "{selectedProperty?.title}"?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-end">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button onClick={deleteProperty} type="button" variant="destructive">
                            {processing ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className='animate-spin w-4 h-4' />
                                    Deleting...
                                </div>
                            ) : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
};

export default Dashboard;
