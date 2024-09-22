"use client";

import blogApi from "@/apis/blogApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableRow
} from "@/components/ui/table";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";

// Define the Blog type
interface Blog {
  id: number;
  title: string;
  caption: string;
  youtubeLink: string;
  createdAt: string;
}

// Create the Blogs Management Page
export default function BlogsManagementPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");


  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const data = await blogApi.getAll();
    setBlogs(data);
  };

  const handleCreateBlog = () => {
    setSelectedBlog(null);
    setTitle("");
    setCaption("");
    setYoutubeLink("");
    setOpenDialog(true);
  };

  const handleEditBlog = (blog: Blog) => {
    setSelectedBlog(blog);
    setTitle(blog.title);
    setCaption(blog.caption);
    setYoutubeLink(blog.youtubeLink);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    fetchBlogs();
  };

  const handleSaveBlog = async () => {
    const newBlog = { title, caption, youtubeLink, createdAt: new Date().toISOString() };
    if (selectedBlog) {
      // Update blog
      await blogApi.update(selectedBlog.id, newBlog);
      toast({
        title: "Blog updated successfully",
        description: "The blog has been updated successfully",
      })
    } else {
      // Create new blog
      await blogApi.create(newBlog);
      toast({
        title: "Blog created successfully",
        description: "The blog has been created successfully",
      })
    }
    handleCloseDialog();
  };

  const handleDeleteBlog = async (id: number) => {
    await blogApi.delete(id);
    toast({
      title: "Blog deleted successfully",
      description: "The blog has been deleted successfully",
    })
    fetchBlogs();
  };

  return (
    <div>
      <Toaster />
        <div className="flex items-center justify-between w-full gap-2">
          <h2 className="text-2xl font-bold flex-1">Blogs</h2>
          <Button variant="default" onClick={handleCreateBlog}>
            Create Blog
          </Button>
        </div>
        <Table className="table-auto w-full mt-4">
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell className="hidden md:table-cell">Caption</TableCell>
          <TableCell className="hidden md:table-cell">Video</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
        <TableBody>
          {blogs.map((blog) => (
            <TableRow key={blog.id}>
              <TableCell>{blog.title}</TableCell>
              <TableCell className="hidden md:table-cell">{blog.caption}</TableCell>
              <TableCell className="hidden md:table-cell">
                <iframe
                  width="200"
                  height="100"
                  src={blog.youtubeLink.replace("watch?v=", "embed/")}
                  title={blog.title}
                  allowFullScreen
                />
              </TableCell>
              <TableCell className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEditBlog(blog)}
                >
                  <PencilIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDeleteBlog(blog.id)}
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedBlog ? "Edit Blog" : "Create Blog"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="caption" className="text-right">
                Caption
              </Label>
              <Input
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="youtubeLink" className="text-right">
                YouTube Link
              </Label>
              <Input
                id="youtubeLink"
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            <Button variant="default" onClick={handleSaveBlog}>
              {selectedBlog ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
