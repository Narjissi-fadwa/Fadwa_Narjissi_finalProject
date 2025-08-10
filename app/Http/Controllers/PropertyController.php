<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\PropertyOffer;
use App\Services\StripeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

use Inertia\Inertia;

class PropertyController extends Controller
{
    protected $stripeService;

    public function __construct(StripeService $stripeService)
    {
        $this->stripeService = $stripeService;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'address' => 'required|string',
            'type' => 'required|in:apartment,house,villa,land',
            'property_subtype' => 'nullable|string',
            'area' => 'required|numeric|min:1',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'listing_type' => 'required|in:sale,rent',
            'bedrooms' => 'nullable|integer|min:1',
            'floors' => 'nullable|string',
            'images' => 'required|array|min:1|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('property-images', 'public');
                $imagePaths[] = $path;
            }
        }

        Property::create([
            'title' => $validated['title'],
            'address' => $validated['address'],
            'type' => $validated['type'],
            'property_subtype' => $validated['property_subtype'] ?? null,
            'area' => $validated['area'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'listing_type' => $validated['listing_type'],
            'bedrooms' => $validated['bedrooms'] ?? null,
            'floors' => $validated['floors'] ?? null,
            'user_id' => Auth::id(),
            'payment_status' => 'pending',
            'status' => 'pending',
            'approval_status' => 'pending',
            'images' => $imagePaths,
        ]);

        return redirect()->back()->with('success', 'Property submitted successfully! It will be reviewed by an agent before activation.');
    }

    public function update(Request $request, Property $property)
    {
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'address' => 'required|string',
            'type' => 'required|in:apartment,house,villa,land',
            'property_subtype' => 'nullable|string',
            'area' => 'required|numeric|min:1',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'listing_type' => 'required|in:sale,rent',
            'bedrooms' => 'nullable|integer|min:1',
            'floors' => 'nullable|string',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'existing_images' => 'nullable|array',
            'existing_images.*' => 'string',
        ]);

        $updateData = [
            'title' => $validated['title'],
            'address' => $validated['address'],
            'type' => $validated['type'],
            'property_subtype' => $validated['property_subtype'] ?? null,
            'area' => $validated['area'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'listing_type' => $validated['listing_type'],
            'bedrooms' => $validated['bedrooms'] ?? null,
            'floors' => $validated['floors'] ?? null,
        ];

        $finalImages = [];
        if ($request->has('existing_images')) {
            $existingImages = $validated['existing_images'] ?? [];
            $finalImages = array_map(function($url) {
                return str_replace('/storage/', '', $url);
            }, $existingImages);
        }
        if ($request->hasFile('images') && count($request->file('images')) > 0) {
            $newImagePaths = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('property-images', 'public');
                $newImagePaths[] = $path;
            }

            $finalImages = array_merge($finalImages, $newImagePaths);
        } else {
            error_log('No images received. hasFile: ' . ($request->hasFile('images') ? 'true' : 'false'));
            error_log('Request files: ' . json_encode($request->allFiles()));
        }
        $updateData['images'] = array_slice($finalImages, 0, 5);

        $property->update($updateData);

        return redirect()->back()->with('success', 'Property updated successfully!');
    }

    public function destroy(Property $property)
    {
        if ($property->user_id !== Auth::id()) {
            abort(403);
        }
        if (!empty($property->images)) {
            foreach ($property->images as $imageUrl) {
                $imagePath = str_replace('/storage/', '', $imageUrl);
                if (Storage::disk('public')->exists($imagePath)) {
                    Storage::disk('public')->delete($imagePath);
                }
            }
        }

        $property->delete();

        return redirect()->back()->with('success', 'Property deleted successfully!');
    }

    public function respondToOffer(Request $request, PropertyOffer $offer)
    {
        if ($offer->property->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => 'required|in:accepted,rejected',
        ]);

        $offer->update([
            'status' => $validated['status'],
            'responded_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Offer response sent successfully!');
    }

    /**
     * Public listing of properties (active + approved) with minimal fields.
     */
    public function index()
    {
        
        $properties = Property::query()
            ->where('status', 'active')
            ->where('approval_status', 'approved')
            ->orderByDesc('id')
            ->paginate(12)
            ->through(function (Property $p) {
                return [
                    'id' => $p->id,
                    'title' => $p->title,
                    'price' => $p->price,
                    'type' => $p->type,
                    'image' => $p->images && count($p->images) > 0 ? (str_starts_with($p->images[0], '/storage/') ? $p->images[0] : '/storage/' . $p->images[0]) : null,
                    'address' => $p->address,
                    'bedrooms' => $p->bedrooms,
                    'area' => $p->area,
                    'owner_id' => $p->user_id,
                ];
            });

        return Inertia::render('properties/Index', [
            'properties' => $properties,
        ]);
    }

    /**
     * Public property detail page.
     */
    public function show(Property $property)
    {
        if ($property->status !== 'active' || $property->approval_status !== 'approved') {
            abort(404);
        }

        $property->load(['owner']);

        $data = [
            'id' => $property->id,
            'title' => $property->title,
            'price' => $property->price,
            'type' => $property->type,
            'address' => $property->address,
            'area' => $property->area,
            'bedrooms' => $property->bedrooms,
            'description' => $property->description,
            'images' => $property->images ? array_map(function ($path) { return str_starts_with($path, '/storage/') ? $path : '/storage/' . $path; }, $property->images) : [],
            'owner' => [
                'id' => $property->owner->id,
                'name' => $property->owner->name,
            ],
        ];

        return Inertia::render('properties/Show', [
            'property' => $data,
        ]);
    }
}