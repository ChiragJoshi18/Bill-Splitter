import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <img src="/bill.png" alt="app-logo" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className='text-2xl'>Bill Splitter</span>
            </div>
        </>
    );
}
