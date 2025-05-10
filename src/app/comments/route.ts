import { comments } from "./data";
export async function GET() {
    return Response.json(comments);
}

export async function POST(request: Request) {
    const { name, age } = await request.json();
    const newComment = {
        id: comments.length + 1,
        name,
        age,
    };
    comments.push(newComment);
    return Response.json(newComment);
}