<script lang="ts">
  import { session } from '$app/stores';
  import AuthModal from '$lib/components/AuthModal/AuthModal.svelte';
  import DarkModeButton from './DarkModeButton.svelte';
  import HomeNavItem from './HomeNavItem.svelte';
  import Template from './Template.svelte';
  import { activeMeeting } from '$lib/app-state';

  export let key: string;

  let showAuthModal = false;
</script>

<Template {key}>
  <svelte:fragment slot="left">
    <HomeNavItem slot="left" />
  </svelte:fragment>
  <svelte:fragment slot="right">
    {#if $session.user !== null}
      <li>
        <a href="/profile" class="text-focusable">
          Hi, <span class="font-bold">{$session.user.name}</span>
        </a>
      </li>
    {:else}
      <li><button on:click={() => (showAuthModal = true)} class="text-focusable">Login</button></li>
    {/if}
    <li><a href="/about" class="text-focusable">About</a></li>
    <li class="flex items-center"><DarkModeButton /></li>
  </svelte:fragment>
</Template>

{#if showAuthModal}
  <AuthModal activeMeeting={$activeMeeting} on:dismiss={() => (showAuthModal = false)} />
{/if}

<style lang="postcss">
  a,
  button {
    @apply font-medium hover:text-primary hover:underline;
  }

  li {
    @apply px-4;
    &:last-child {
      @apply pr-0;
    }
  }
</style>
