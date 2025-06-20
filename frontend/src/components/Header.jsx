"use client";

import React, { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "./ui/navigation-menu";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, setUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data.user))
        .catch((err) => {
          console.log(err);
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {
        email: user.email,
      });
      localStorage.removeItem("token");
      setUser(null);
      router.push("/signin");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.webp"
            alt="Jewellery Store Logo"
            className="h-10 w-auto"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-6">
              <NavigationMenuItem>
                <NavigationMenuLink href="/" className="hover:underline">
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Collections</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white shadow-md rounded-md">
                  <div className="flex flex-col gap-2 p-4 min-w-[180px]">
                    <NavigationMenuLink href="/collections/rings">
                      Rings
                    </NavigationMenuLink>
                    <NavigationMenuLink href="/collections/necklaces">
                      Necklaces
                    </NavigationMenuLink>
                    <NavigationMenuLink href="/collections/earrings">
                      Earrings
                    </NavigationMenuLink>
                    <NavigationMenuLink href="/collections/braceletsAndBangles">
                      Bracelets and Bangles
                    </NavigationMenuLink>
                    <NavigationMenuLink href="/collections/Pendants">
                      Pendants
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/about" className="hover:underline">
                  About Us
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/contact" className="hover:underline">
                  Contact
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="w-5 h-5" />
            </Button>

            {user ? (
              // If user is logged in, show avatar and logout
              <div className="flex items-center gap-3">
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user.photo || "/user.jpg"} alt="User" />
                  <AvatarFallback>
                    {user.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              // Otherwise show login/register
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Link href="/signin">Signin</Link>
                </Button>
                <Button variant="default" size="sm">
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md mt-2 px-4 py-4 space-y-3">
          <Link href="/" className="block text-gray-700 hover:underline">
            Home
          </Link>
          <div>
            <p className="font-semibold">Collections</p>
            <div className="pl-4 mt-1 space-y-1">
              <Link href="/collections/rings" className="block hover:underline">
                Rings
              </Link>
              <Link
                href="/collections/necklaces"
                className="block hover:underline"
              >
                Necklaces
              </Link>
              <Link
                href="/collections/earrings"
                className="block hover:underline"
              >
                Earrings
              </Link>
              <Link
                href="/collections/braceltesAndBangles"
                className="block hover:underline"
              >
                Bracelets and Bangles
              </Link>
              <Link
                href="/collections/pendants"
                className="block hover:underline"
              >
                Pendants
              </Link>
            </div>
          </div>
          <Link href="/about" className="block text-gray-700 hover:underline">
            About Us
          </Link>
          <Link href="/contact" className="block text-gray-700 hover:underline">
            Contact
          </Link>

          {/* User Section */}
          <div className="pt-4 border-t mt-4">
            {user ? (
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.photo || "/user.jpg"} alt="User" />
                  <AvatarFallback>
                    {user.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user.username}</span>
              </div>
            ) : null}

            {user ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="w-full">
                  <Link href="/signin">Signin</Link>
                </Button>
                <Button variant="default" size="sm" className="w-full mt-2">
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
