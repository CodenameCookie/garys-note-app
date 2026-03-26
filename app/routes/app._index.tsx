import type { LoaderFunctionArgs } from "@remix-run/node";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

export default function Index() {
  return (
    <Page>
      <TitleBar title="Easy Internal Notes" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingLg">
                Welcome to Easy Internal Notes! 📝
              </Text>
              <Text as="p" variant="bodyMd">
                Your app is successfully installed and ready to use. 
              </Text>
              
              <Text as="h3" variant="headingMd">
                How to use the app:
              </Text>
              <List type="number">
                <List.Item>Navigate to any <b>Product</b> in your Shopify Admin.</List.Item>
                <List.Item>Click on the product to open its details page.</List.Item>
                <List.Item>In the layout editor (if you are customizing the page), click <b>Add block</b> and select "Easy Internal Notes".</List.Item>
                <List.Item>You can <b>drag and drop</b> the block anywhere on the page, including the right-hand column!</List.Item>
              </List>
              
              <Box paddingBlockStart="400">
                <Button variant="primary" url="shopify:admin/products" target="_top">
                  Go to Products
                </Button>
              </Box>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
