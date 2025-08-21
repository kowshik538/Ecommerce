import React from 'react';
import { Link } from 'react-router-dom';
import { blogs } from '../data/blogs';

const BlogPreview = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Fashion Tips & Blogs</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {blogs.map((blog, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition duration-300"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{blog.title}</h3>
                <p className="text-gray-600 text-sm">{blog.excerpt}</p>
                <Link
                  to={`/blog/${blog.slug}`}
                  className="mt-4 inline-block text-indigo-600 font-medium hover:underline"
                >
                  Read more →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
