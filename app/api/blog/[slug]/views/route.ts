import dbConnect from "@/app/api/lib/dbConnect";
import Views from "@/app/api/models/Views";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
    try {
        await dbConnect();
        const slug = params.slug;
        const viewsCount = await Views.countDocuments({ slug });

        return NextResponse.json({ views: viewsCount }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || 'Something went wrong!' }, { status: 500 });
    }
}

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
    const { slug } = params;
    const { uniqueVisitorId } = await request.json()

    try {
        await dbConnect();

        // Check if this visitor has already viewed this post
        const existingView = await Views.findOne({ slug, uniqueVisitorId });

        if (!existingView) {
            // Create a new view record
            const newView = new Views({ slug, uniqueVisitorId });
            await newView.save();
        }

        const viewsCount = await Views.countDocuments({ slug });

        return NextResponse.json({ views: viewsCount }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || 'Something went wrong!' }, { status: 500 });
    }
}