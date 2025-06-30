import { Button } from "@/components/ui/common";
import { LogOut, Wallet, ExternalLink } from "lucide-react";
import { useLogout, useUser } from "@account-kit/react";

export default function Header() {
  const { logout } = useLogout();
  const user = useUser();
  
  // Use user presence to determine connection
  const isConnected = !!user;
  const walletType = user?.type === 'eoa' ? 'External Wallet' : 'Smart Wallet';

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Wallet className="h-6 w-6 text-gray-800" />
          <span className="text-lg font-semibold text-gray-800">
            Smart Wallets
          </span>
        </div>

        {isConnected && (
          <div className="flex items-center gap-4">
            {/* Connection status */}
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">{walletType}</span>
              </div>
              
              {/* Show user info if available */}
              {user?.email && (
                <span className="text-gray-500">({user.email})</span>
              )}
              
              {/* Show truncated address */}
              {user?.address && (
                <span className="text-gray-500 font-mono text-xs">
                  {`${user.address.slice(0, 6)}...${user.address.slice(-4)}`}
                </span>
              )}
            </div>

            {/* External link for EOAs */}
            {user?.type === 'eoa' && user?.address && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-xs"
                onClick={() => window.open(`https://sepolia.etherscan.io/address/${user.address}`, '_blank')}
              >
                <ExternalLink className="h-3 w-3" />
                View
              </Button>
            )}

            {/* Logout button */}
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => logout()}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
