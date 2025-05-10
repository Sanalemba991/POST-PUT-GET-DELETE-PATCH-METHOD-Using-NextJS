import { comments } from "./data";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");

    // Filter comments based on the query
    const filteredComments = query
        ? comments.filter((comment) => comment.name.includes(query))
        : comments;

    return new Response(JSON.stringify(filteredComments), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export async function POST(request: Request) {
    try {
        const { name, age } = await request.json();

        // Validate the request body
        if (typeof name !== "string" || typeof age !== "number") {
            return new Response(JSON.stringify({ error: "Invalid request body" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const newComment = {
            id: comments.length + 1,
            name,
            age,
        };

        comments.push(newComment);

        return new Response(JSON.stringify(newComment), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error processing POST request:", error);

        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
