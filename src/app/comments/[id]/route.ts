import { comments } from "../data";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
        return new Response("Invalid ID", { status: 400 });
    }

    const comment = comments.find((comment) => comment.id === id);
    if (!comment) {
        return new Response("Comment not found", { status: 404 });
    }

    return new Response(JSON.stringify(comment), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        // Await params to ensure they are resolved
        const resolvedParams = await context.params;
        const id = parseInt(resolvedParams.id, 10);

        if (isNaN(id)) {
            return new Response(JSON.stringify({ error: "Invalid ID" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const index = comments.findIndex((comment) => comment.id === id);
        if (index === -1) {
            return new Response(JSON.stringify({ error: "Comment not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Parse the request body
        let body;
        try {
            body = await request.json();
        } catch (error) {
            return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const { name } = body;

        // Validate the request body
        if (typeof name !== "string") {
            return new Response(JSON.stringify({ error: "Invalid request body: 'name' must be a string" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Update the comment
        comments[index].name = name;

        return new Response(JSON.stringify(comments[index]), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error processing PATCH request:", error);

        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
        return new Response("Invalid ID", { status: 400 });
    }

    const index = comments.findIndex((comment) => comment.id === id);
    if (index === -1) {
        return new Response("Comment not found", { status: 404 });
    }

    comments.splice(index, 1);
    return new Response("Comment deleted", { status: 200 });
}

