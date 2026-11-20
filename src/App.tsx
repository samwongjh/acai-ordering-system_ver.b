import { useCallback, useEffect, useMemo, useState } from 'react';
import { Clock, ShoppingCart, Tag, UtensilsCrossed, X } from 'lucide-react';
import type {
  CartItem,
  FulfillmentMode,
  MemberAccount,
  MenuCategoryId,
  MenuItem,
  Order,
} from './types.ts';
import { MENU_CATEGORIES, MENU_ITEMS, OUTLET_INFO } from './data/menuData.ts';
import { TopHeader, type AppView } from './components/TopHeader.tsx';
import { BellyClubSubHeader } from './components/BellyClubSubHeader.tsx';
import { OutletHeroBanner } from './components/OutletHeroBanner.tsx';
import { CategoryTabs } from './components/CategoryTabs.tsx';
import { MenuGrid } from './components/MenuGrid.tsx';
import { ItemCustomizationSheet } from './components/ItemCustomizationSheet.tsx';
import { CartCheckoutPanel } from './components/CartCheckoutPanel.tsx';
import { OrderTrackerView } from './components/OrderTrackerView.tsx';
import { SummerClubView } from './components/SummerClubView.tsx';
import { PromotionsView } from './components/PromotionsView.tsx';
import { AuthModal } from './components/AuthModal.tsx';

const STORAGE_CART_KEY = 'bellybelly_cart_v1';
const STORAGE_TOKEN_KEY = 'bellybelly_token_v1';
const STORAGE_ACTIVE_ORDER_KEY = 'bellybelly_active_order_id_v1';

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('menu');
  const [fulfillmentMode, setFulfillmentMode] = useState<FulfillmentMode>('pickup');
  const [activeCategory, setActiveCategory] = useState<MenuCategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CART_KEY);
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  const [authToken, setAuthToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_TOKEN_KEY);
    } catch {
      return null;
    }
  });
  const [member, setMember] = useState<MemberAccount | null>(null);

  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const openAuthModal = useCallback((mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2600);
  }, []);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cart));
    } catch {
      // Ignore storage quota errors
    }
  }, [cart]);

  // Restore member session if token exists
  useEffect(() => {
    if (!authToken) return;
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.member) {
          setMember(data.member);
        } else {
          setAuthToken(null);
          localStorage.removeItem(STORAGE_TOKEN_KEY);
        }
      })
      .catch(() => {});
  }, [authToken]);

  // Restore last active order if present
  useEffect(() => {
    try {
      const savedOrderId = localStorage.getItem(STORAGE_ACTIVE_ORDER_KEY);
      if (!savedOrderId) return;
      fetch(`/api/orders/${encodeURIComponent(savedOrderId)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.order) setActiveOrder(data.order);
        })
        .catch(() => {});
    } catch {
      // Ignore
    }
  }, []);

  const handleAuthSuccess = useCallback(
    (loggedInMember: MemberAccount, token: string) => {
      setMember(loggedInMember);
      setAuthToken(token);
      try {
        localStorage.setItem(STORAGE_TOKEN_KEY, token);
      } catch {
        // Ignore
      }
      showToast(`Signed in as ${loggedInMember.name}`);
    },
    [showToast]
  );

  const handleLogout = useCallback(async () => {
    if (authToken) {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
      }).catch(() => {});
    }
    setMember(null);
    setAuthToken(null);
    try {
      localStorage.removeItem(STORAGE_TOKEN_KEY);
    } catch {
      // Ignore
    }
    showToast('Signed out');
  }, [authToken, showToast]);

  const handleAddToCart = useCallback(
    (newItem: CartItem) => {
      setCart((prev) => [...prev, newItem]);
      showToast(`Added ${newItem.name} to cart`);
    },
    [showToast]
  );

  const handleQuickAddItem = useCallback(
    (item: MenuItem) => {
      const defaultModifiers = item.modifierGroups
        .filter((g) => g.required && g.options.length > 0)
        .map((g) => {
          const opt = g.options.find((o) => o.isDefault) || g.options[0];
          return {
            groupId: g.id,
            groupTitle: g.title,
            optionId: opt.id,
            optionName: opt.name,
            priceDelta: opt.priceDelta,
          };
        });
      const modTotal = defaultModifiers.reduce((s, m) => s + m.priceDelta, 0);
      const unitPrice = Number((item.basePrice + modTotal).toFixed(2));
      handleAddToCart({
        cartItemId: `${item.id}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        menuItemId: item.id,
        name: item.name,
        image: item.image,
        unitBasePrice: item.basePrice,
        selectedModifiers: defaultModifiers,
        specialInstructions: '',
        quantity: 1,
        lineTotal: unitPrice,
      });
    },
    [handleAddToCart]
  );

  const handleUpdateCartQty = useCallback((cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId !== cartItemId) return item;
          const nextQty = item.quantity + delta;
          if (nextQty <= 0) return null;
          const modPerUnit = item.selectedModifiers.reduce((s, m) => s + m.priceDelta, 0);
          const unitPrice = item.unitBasePrice + modPerUnit;
          return {
            ...item,
            quantity: nextQty,
            lineTotal: Number((unitPrice * nextQty).toFixed(2)),
          };
        })
        .filter((x): x is CartItem => x !== null)
    );
  }, []);

  const handleRemoveCartItem = useCallback((cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  }, []);

  const handleOrderCreated = useCallback(
    (order: Order, updatedMember: MemberAccount | null) => {
      setActiveOrder(order);
      if (updatedMember) setMember(updatedMember);
      setCart([]);
      setMobileCartOpen(false);
      setActiveView('track');
      try {
        localStorage.setItem(STORAGE_ACTIVE_ORDER_KEY, order.id);
      } catch {
        // Ignore
      }
      showToast(`Order #${order.queueNumber} confirmed!`);
    },
    [showToast]
  );

  const handleReorder = useCallback(
    (order: Order) => {
      const cloned = order.items.map((item) => ({
        ...item,
        cartItemId: `${item.menuItemId}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      }));
      setCart(cloned);
      setFulfillmentMode(order.fulfillmentMode);
      setActiveView('menu');
      showToast(`Loaded ${cloned.length} items from #${order.queueNumber}`);
    },
    [showToast]
  );

  const itemCountByMenuId = useMemo(() => {
    const map: Record<string, number> = {};
    for (const ci of cart) {
      map[ci.menuItemId] = (map[ci.menuItemId] || 0) + ci.quantity;
    }
    return map;
  }, [cart]);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);
  const cartSubtotal = useMemo(
    () => Number(cart.reduce((s, i) => s + i.lineTotal, 0).toFixed(2)),
    [cart]
  );

  const upsellItems = useMemo(
    () =>
      MENU_ITEMS.filter(
        (m) => m.id === 'thirst-strawberry-matcha' || m.id === 'thirst-coconut-latte'
      ),
    []
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F7] text-[#1C1523]">
      <div className="sticky top-0 z-30">
        <TopHeader
          activeView={activeView}
          onChangeView={setActiveView}
          onOpenAuthModal={() => openAuthModal('login')}
          onOpenMobileCart={() => setMobileCartOpen(true)}
          member={member}
          cartCount={cartCount}
          hasActiveOrder={Boolean(activeOrder && activeOrder.status !== 'completed')}
        />

        <BellyClubSubHeader
          member={member}
          isClubActive={activeView === 'club'}
          onOpenBellyClub={() => setActiveView('club')}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-12">
        {activeView === 'menu' && (
          <>
            <OutletHeroBanner
              outlet={OUTLET_INFO}
              fulfillmentMode={fulfillmentMode}
              onChangeFulfillment={setFulfillmentMode}
            />

            <CategoryTabs
              categories={MENU_CATEGORIES}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              searchQuery={searchQuery}
              onChangeSearch={setSearchQuery}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
                {/* Left / Main Menu Feed */}
                <div className="lg:col-span-8">
                  <MenuGrid
                    items={MENU_ITEMS}
                    activeCategory={activeCategory}
                    searchQuery={searchQuery}
                    itemCountByMenuId={itemCountByMenuId}
                    onSelectItem={setCustomizingItem}
                    onQuickAddItem={handleQuickAddItem}
                  />
                </div>

                {/* Desktop Sticky Qlub Cart & Checkout Sidebar */}
                <aside className="hidden lg:block lg:col-span-4 sticky top-[178px] h-[calc(100vh-198px)]">
                  <CartCheckoutPanel
                    items={cart}
                    fulfillmentMode={fulfillmentMode}
                    onChangeFulfillment={setFulfillmentMode}
                    onUpdateQuantity={handleUpdateCartQty}
                    onRemoveItem={handleRemoveCartItem}
                    onClearCart={() => setCart([])}
                    upsellItems={upsellItems}
                    onQuickAddUpsell={handleQuickAddItem}
                    member={member}
                    authToken={authToken}
                    onOpenSignUp={() => openAuthModal('register')}
                    onAuthSuccess={handleAuthSuccess}
                    onOrderCreated={handleOrderCreated}
                  />
                </aside>
              </div>
            </div>
          </>
        )}

        {activeView === 'track' && (
          <OrderTrackerView
            activeOrder={activeOrder}
            onUpdateOrder={setActiveOrder}
            onBackToMenu={() => setActiveView('menu')}
          />
        )}

        {activeView === 'club' && (
          <SummerClubView
            member={member}
            authToken={authToken}
            onOpenSignUp={() => openAuthModal('register')}
            onOpenSignIn={() => openAuthModal('login')}
            onLogout={handleLogout}
            onTrackOrder={(ord) => {
              setActiveOrder(ord);
              setActiveView('track');
            }}
            onReorder={handleReorder}
          />
        )}
        {activeView === 'promotions' && (
          <PromotionsView
            outlet={OUTLET_INFO}
            onBrowseMenu={() => setActiveView('menu')}
          />
        )}
      </main>

      {/* Quiet Desktop Footer */}
      <footer className="hidden md:block border-t border-[#1C1523]/8 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between text-xs text-[#665E6E]">
          <span>BellyBelly Good · Exclusive Flagship · 28 Keong Saik Road, #01-01</span>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setActiveView('promotions')}
              className="hover:text-[#1C1523] cursor-pointer"
            >
              Promotions
            </button>
            <button
              type="button"
              onClick={() => setActiveView('track')}
              className="hover:text-[#1C1523] cursor-pointer"
            >
              Order Lookup
            </button>
            <span>Prices in SGD incl. 9% GST</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Fixed Bar (Strictly <= 58px so Top 52px + Bottom 58px = 110px < 15% cap) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#1C1523]/10">
        {activeView === 'menu' && cartCount > 0 ? (
          <div className="px-3 py-2">
            <button
              type="button"
              onClick={() => setMobileCartOpen(true)}
              className="w-full h-11 rounded-xl bg-[#1C1523] hover:bg-[#5B2378] text-white px-4 flex items-center justify-between text-sm font-semibold shadow-sm active:scale-[0.99] transition-transform cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                <span>View Cart ({cartCount})</span>
              </span>
              <span className="font-mono tabular-nums">S${cartSubtotal.toFixed(2)}</span>
            </button>
          </div>
        ) : (
          <nav className="grid grid-cols-3 h-[56px]" aria-label="Mobile navigation">
            <button
              type="button"
              onClick={() => setActiveView('menu')}
              className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium cursor-pointer ${
                activeView === 'menu' ? 'text-[#5B2378] font-semibold' : 'text-[#665E6E]'
              }`}
            >
              <UtensilsCrossed className="w-5 h-5" />
              <span>Menu</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('promotions')}
              className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium cursor-pointer ${
                activeView === 'promotions' ? 'text-[#5B2378] font-semibold' : 'text-[#665E6E]'
              }`}
            >
              <Tag className="w-5 h-5" />
              <span>Promotions</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('track')}
              className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium cursor-pointer ${
                activeView === 'track' ? 'text-[#5B2378] font-semibold' : 'text-[#665E6E]'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span>Track Order</span>
            </button>
          </nav>
        )}
      </div>

      {/* Responsive Cart & Checkout Drawer (Bottom Sheet on Mobile, Right Slide-Over on Tablet/Desktop) */}
      {mobileCartOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end md:items-stretch md:justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Cart and checkout"
          onClick={() => setMobileCartOpen(false)}
        >
          <div
            className="w-full h-[92vh] md:h-full md:max-w-md bg-white rounded-t-3xl md:rounded-none md:rounded-l-2xl overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CartCheckoutPanel
              items={cart}
              fulfillmentMode={fulfillmentMode}
              onChangeFulfillment={setFulfillmentMode}
              onUpdateQuantity={handleUpdateCartQty}
              onRemoveItem={handleRemoveCartItem}
              onClearCart={() => setCart([])}
              upsellItems={upsellItems}
              onQuickAddUpsell={handleQuickAddItem}
              member={member}
              authToken={authToken}
              onOpenSignUp={() => openAuthModal('register')}
              onAuthSuccess={handleAuthSuccess}
              onOrderCreated={handleOrderCreated}
              onCloseMobile={() => setMobileCartOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Item Customization Bottom Sheet / Modal */}
      <ItemCustomizationSheet
        item={customizingItem}
        onClose={() => setCustomizingItem(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Member Sign In / Sign Up Modal */}
      <AuthModal
        open={authModalOpen}
        initialTab={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Subtle Action Toast */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-[#1C1523] text-white text-xs font-medium shadow-lg flex items-center gap-3 whitespace-nowrap"
        >
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            aria-label="Dismiss notification"
            className="text-white/70 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
