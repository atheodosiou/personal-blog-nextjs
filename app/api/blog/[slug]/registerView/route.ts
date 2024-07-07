import dbConnect from "@/app/api/lib/dbConnect";
import Views from "@/app/api/models/Views";
import { NextRequest, NextResponse } from "next/server";
import hash from 'object-hash';

function generateUniqueIdentifier(req: NextRequest, slug:string) {
    const ip = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];
    const userAgent = (req.headers.get('user-agent') ?? '127.0.0.1').split(',')[0];
    return hash({ip,userAgent, slug});
}

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
    const { slug } = params;
    const uniqueVisitorId = generateUniqueIdentifier(request,slug);
    console.log(uniqueVisitorId)
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