<script lang="ts">
  import { fly } from 'svelte/transition';
  import { receive, send } from '$lib/app-state';

  export let key: string;
</script>

{#if key === '/'}
  <nav transition:fly={{ y: -50 }} class="fixed inset-0 bottom-auto z-50">
    <div class="flex items-center justify-end mx-auto max-w-7xl dark:text-white">
      <ul class="flex items-center p-4 divide-x divide-gray-400">
        <slot name="right" />
      </ul>
    </div>
  </nav>
{:else}
  <nav
    in:receive={{ key: 'header' }}
    out:send={{ key: 'header' }}
    class="fixed inset-0 bottom-auto z-50 rounded-t-none card"
  >
    <div class="flex items-center justify-between mx-auto max-w-7xl dark:text-white">
      <ul class="flex items-center p-4 space-x-3">
        <slot name="left" />
      </ul>
      <ul class="flex items-center p-4 divide-x divide-gray-400">
        <slot name="right" />
      </ul>
    </div>
  </nav>
{/if}
