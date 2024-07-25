import * as React from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import type { ContactsListFragment$key } from "./__generated__/ContactsListFragment.graphql";
import Card from "./Card";
import ContactRow from "./ContactRow";

export type Props = {
  viewer: ContactsListFragment$key;
};

const ContactsListFragment = graphql`
  fragment ContactsListFragment on Viewer (
    @argumentDefinitions(search: {type: 'String', defaultValue: null}
  )
  {
    contacts(search: $search) {
      id
      ...ContactRowFragment
    }
  }
`;

export default function ContactsList({ viewer }: Props) {
  const data = useFragment(ContactsListFragment, viewer);
  return (
    <Card dim={true}>
      <h3>Contacts</h3>
      {data.contacts.map((contact) => (
        <ContactRow key={contact.id} contact={contact} />
      ))}
    </Card>
  );
}
